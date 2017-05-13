var
	extend               = req('/utilities/extend'),
	InboundConnection    = req('/lib/server/connections/inbound'),
	ConnectionEvents     = req('/constants/connection-events'),
	Commands             = req('/constants/commands'),
	SourceTypes          = req('/constants/source-types'),
	UserDetails          = req('/lib/user-details'),
	NotRegisteredMessage = req('/lib/server/messages/not-registered');


class ClientConnection extends InboundConnection {

	constructor(socket) {
		super(socket);

		this.modes  = [ ];

		this.getUserDetails().setHostname(this.getIP());
	}

	handleInboundMessage(message) {
		if (!this.hasRegistered()) {
			this.handlePreRegistrationMessage(message);
		}

		message.setUserDetails(this.getUserDetails());

		this.emit(ConnectionEvents.INCOMING_MESSAGE, message);
	}

	handlePreRegistrationMessage(message) {
		switch (message.getCommand()) {
			case Commands.NICK:
				return this.handlePreRegistrationNickMessage(message);

			case Commands.USER:
				return this.handlePreRegistrationUserMessage(message);

			case Commands.PASS:
			case Commands.CAP:
				return this.queueMessageUntilRegistration(message);

			default:
				return this.handleUnsupportedPreregistrationMessage(message);
		}
	}

	handlePreRegistrationNickMessage(message) {
		// Note that this duplicates functionality performed by the Nicks
		// service. This is necessary in order for response messages from
		// the server to this client during its eventual registration to be
		// generated successfully.
		this.getUserDetails().setNick(message.getDesiredNick());

		this.queueMessageUntilRegistration(message);
		this.setHasReceivedRegistrationNickMessage(true);
	}

	handlePreRegistrationUserMessage(message) {
		// Note that this duplicates functionality performed by the Users
		// service. This is necessary in order for response messages from
		// the server to this client during its eventual registration to be
		// generated successfully.
		var user_details = this.getUserDetails();

		user_details.setUsername(message.getUsername());
		user_details.setRealname(message.getRealname());

		this.queueMessageUntilRegistration(message);
		this.setHasReceivedRegistrationUserMessage(true);
	}

	handleUnsupportedPreregistrationMessage(inbound_message) {
		var outbound_message = new NotRegisteredMessage();

		if (inbound_message.hasCommand()) {
			outbound_message.setAttemptedCommand(inbound_message.getCommand());
		}

		this.sendMessage(outbound_message);
	}

	sendMessage(message) {
		console.log('will check reply numeric...');
		if (message.hasReplyNumeric()) {
			console.log('IT HAS A REPLY NUMERIC.');
			message.addTarget(this.getUserDetails());
		} else {
			console.log('NO REPLY NUMERIC???');
		}

		return super.sendMessage(message);
	}

	getUserDetails() {
		if (!this.user_details) {
			this.user_details = new UserDetails();

			let id = this.id.toString(16).toUpperCase();

			this.user_details.setPreregistrationId(id);
		}

		return this.user_details;
	}

	setHostDetails(server_details) {
		// TODO: Probably just pass the server details directly
		// to the user details.
		this.getUserDetails().setServerName(server_details.getName());
		this.getUserDetails().setServerHostname(server_details.getHostname());

		return super.setHostDetails(server_details);
	}

	/**
	 * @returns {boolean}
	 */
	hasRegistered() {
		return this.has_registered === true;
	}

	setHasRegistered(has_registered) {
		this.has_registered = has_registered;
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
		return this.is_registering === true;
	}

	setIsRegistering(is_registering) {
		this.is_registering = is_registering;
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
		var queue = this.registration_message_queue;

		// That way, we can immediately unassign it to prevent cases
		// where straggling messages end up back in the queue after we
		// thought we'd emptied it.
		this.registration_message_queue = null;

		queue.forEach(this.dispatchMessage, this);

		return this;
	}

	getSourceType() {
		return SourceTypes.CLIENT;
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

}


extend(ClientConnection.prototype, {

	registration_user_message_received: false,
	registration_nick_message_received: false,

	has_registered:                     false,
	is_registering:                     false,
	registration_message_queue:         null,

	user_details:                       null,
	server_details:                     null

});


function fromPendingConnection(pending_connection) {
	var socket = pending_connection.getSocket();

	return new ClientConnection(socket);
}

ClientConnection.fromPendingConnection = fromPendingConnection;


module.exports = ClientConnection;