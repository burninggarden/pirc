var
	extend                   = req('/lib/utility/extend'),
	Server_Connection_Remote = req('/lib/server/connection/remote'),
	UserDetails              = req('/lib/user-details');


var
	Enum_ConnectionEvents = req('/lib/enum/connection-events'),
	Enum_Commands         = req('/lib/enum/commands'),
	Enum_SourceTypes      = req('/lib/enum/source-types'),
	Enum_UserModes        = req('/lib/enum/user-modes');

var
	Message_Reply_NotRegistered     = req('/lib/message/reply/not-registered'),
	Message_Reply_AlreadyRegistered = req('/lib/message/reply/already-registered');


class Server_Connection_Client extends Server_Connection_Remote {

	constructor() {
		super();
		this.modes  = [ ];
	}

	/**
	 * Override the parent class's setSocket() method in order to assign
	 * the client's hostname from their remote address.
	 *
	 * @param   {Net.Socket} socket
	 * @returns {self}
	 */
	setSocket(socket) {
		super.setSocket(socket);

		if (socket) {
			this.getUserDetails().setHostname(this.getIP());
		}

		return this;
	}

	handleInboundMessage(message) {
		if (this.isDisconnected() || this.isDisconnecting()) {
			return;
		}

		if (this.shouldSendAlreadyRegisteredReplyForMessage(message)) {
			return this.sendAlreadyRegisteredReplyForMessage(message);
		}

		if (!this.isRegistered()) {
			this.handlePreRegistrationMessage(message);
		} else {
			message.parseParameters();
		}

		if (this.hasUserId()) {
			message.setOriginUserId(this.getUserId());
		}

		this.emit(Enum_ConnectionEvents.INCOMING_MESSAGE, this, message);
	}

	shouldSendAlreadyRegisteredReplyForMessage(message) {
		if (!this.isRegistered()) {
			return false;
		}

		var command = message.getCommand();

		switch (command) {
			case Enum_Commands.USER:
			case Enum_Commands.PASS:
				return true;

			default:
				return false;
		}
	}

	sendAlreadyRegisteredReplyForMessage(message) {
		var message = new Message_Reply_AlreadyRegistered();

		this.sendMessage(message);
	}

	handlePreRegistrationMessage(message) {
		switch (message.getCommand()) {
			case Enum_Commands.NICK:
				return this.handlePreRegistrationNickMessage(message);

			case Enum_Commands.USER:
				return this.handlePreRegistrationUserMessage(message);

			case Enum_Commands.PASS:
				return this.handlePreRegistrationPassMessage(message);

			case Enum_Commands.CAP:
				return this.queueMessageUntilRegistration(message);

			default:
				return this.handleUnsupportedPreregistrationMessage(message);
		}
	}

	handlePreRegistrationNickMessage(message) {
		message.parseParameters();

		if (message.hasImmediateResponse()) {
			return void message.setIsLethal();
		}

		// Note that this duplicates functionality performed by the Nicks
		// service. This is necessary in order for response messages from
		// the server to this client during its eventual registration to be
		// generated successfully.
		this.getUserDetails().setNickname(message.getNickname());
		this.setHasReceivedRegistrationNickMessage(true);
	}

	handlePreRegistrationUserMessage(message) {
		message.parseParameters();

		if (message.hasImmediateResponse()) {
			return void message.setIsLethal();
		}

		var user_details = this.getUserDetails();

		user_details.setUsername(message.getUsername());
		user_details.setRealname(message.getRealname());

		this.setHasReceivedRegistrationUserMessage(true);
	}

	handlePreRegistrationPassMessage(message) {
		message.parseParameters();

		if (message.hasImmediateResponse()) {
			return void message.setIsLethal();
		}

		this.getUserDetails().setPassword(message.getPassword());
	}

	handleUnsupportedPreregistrationMessage(inbound_message) {
		var outbound_message = new Message_Reply_NotRegistered();

		this.sendMessage(outbound_message);
	}

	getUserDetails() {
		if (!this.user_details) {
			this.user_details = new UserDetails();

			this.user_details.setIsRegistered(false);
		}

		return this.user_details;
	}

	getTargetString() {
		if (!this.isRegistered()) {
			return '*';
		}

		return this.getNickname();
	}

	getUserId() {
		return this.getUserDetails().getUserId();
	}

	/**
	 * @returns {boolean}
	 */
	isRegistered() {
		return this.getUserDetails().isRegistered();
	}

	setIsRegistered(is_registered) {
		this.getUserDetails().setIsRegistered(is_registered);
		return this;
	}

	/**
	 * @returns {boolean}
	 */
	canRegister() {
		if (this.isRegistering()) {
			return false;
		}

		return (
			   this.hasReceivedRegistrationNickMessage()
			&& this.hasReceivedRegistrationUserMessage()
		);
	}

	isRegistering() {
		return this.getUserDetails().isRegistering();
	}

	setIsRegistering(is_registering) {
		return this.getUserDetails().setIsRegistering(is_registering);
	}

	/**
	 * @returns {boolean}
	 */
	hasReceivedRegistrationNickMessage() {
		return this.registration_nick_message_received;
	}

	/**
	 * Store whether this client connection has received a registration
	 * NICK message. This is necessary before the connection can be properly
	 * activated.
	 *
	 * @param   {boolean} value
	 * @returns {self}
	 */
	setHasReceivedRegistrationNickMessage(value) {
		this.registration_nick_message_received = value;

		return this;
	}

	/**
	 * @returns {boolean}
	 */
	hasReceivedRegistrationUserMessage() {
		return this.registration_user_message_received;
	}

	/**
	 * Store whether this client connection has received a registration
	 * USER message. This is necessary before the connection can be properly
	 * activated.
	 *
	 * @param   {boolean} value
	 * @returns {self}
	 */
	setHasReceivedRegistrationUserMessage(value) {
		this.registration_user_message_received = value;

		return this;
	}

	queueMessageUntilRegistration(message) {
		this.getRegistrationMessageQueue().push(message);
		return this;
	}

	/**
	 * @returns {array}
	 */
	getRegistrationMessageQueue() {
		if (!this.registration_message_queue) {
			this.registration_message_queue = [ ];
		}

		return this.registration_message_queue;
	}

	/**
	 * Following successful client registration (a USER and NICK message pair
	 * were received), dequeue any messages (including the USER and NICK
	 * messages themselves) that may have been received prior to registration
	 * being completed.
	 *
	 * @returns {self}
	 */
	dequeueMessagesFollowingRegistration() {
		// Make a copy of the queue message array...
		var queue = this.getRegistrationMessageQueue();

		// That way, we can immediately unassign it to prevent cases
		// where straggling messages end up back in the queue after we
		// thought we'd emptied it.
		this.registration_message_queue = null;

		queue.forEach(this.handleInboundMessageSafe, this);

		return this;
	}

	getSourceType() {
		return Enum_SourceTypes.CLIENT;
	}

	isServer() {
		return false;
	}

	getIP() {
		var ip = this.getSocket().remoteAddress;

		if (ip.indexOf('::ffff:') === 0) {
			ip = ip.slice(7);
		}

		return ip;
	}

	getUserId() {
		return this.getUserDetails().getUserId();
	}

	hasUserId() {
		return this.getUserId() !== null;
	}

	getNickname() {
		return this.getUserDetails().getNickname();
	}

	hasNickname() {
		return this.getNickname() !== null;
	}

	getUsername() {
		return this.getUserDetails().getUsername();
	}

	hasUsername() {
		return this.getUsername() !== null;
	}

	setHostname(hostname) {
		return this.getUserDetails().setHostname(hostname);
	}

	hasPassword() {
		return this.getPassword() !== null;
	}

	getPassword() {
		return this.getUserDetails().getPassword();
	}

	setIsAuthenticated(is_authenticated) {
		return this.getUserDetails().setIsAuthenticated(is_authenticated);
	}

	/**
	 * @returns {boolean}
	 */
	isRestricted() {
		return this.getUserDetails().isRestricted();
	}

	/**
	 * @returns {boolean}
	 */
	isOperator() {
		return this.getUserDetails().isOperator();
	}

	/**
	 * @param   {string} message
	 * @returns {self}
	 */
	setAwayMessage(message) {
		var user_details = this.getUserDetails();

		user_details.setAwayMessage(message);

		if (message) {
			user_details.addMode(Enum_UserModes.AWAY);
		} else {
			user_details.removeMode(Enum_UserModes.AWAY);
		}

		return this;
	}

}


extend(Server_Connection_Client.prototype, {

	registration_user_message_received: false,
	registration_nick_message_received: false,

	registration_message_queue:         null,

	user_details:                       null,
	server_details:                     null

});


/**
 * @param   {lib/server/connections/pending} pending_connection
 * @returns {lib/server/connections/client}
 */
function fromPendingConnection(pending_connection) {
	var
		socket = pending_connection.getSocket(),
		client = new Server_Connection_Client();

	client.setInboundSocket(socket);

	return client;
}

Server_Connection_Client.fromPendingConnection = fromPendingConnection;


module.exports = Server_Connection_Client;
