var
	extend                 = req('/utilities/extend'),
	Connection             = req('/lib/connection'),
	ClientConnectionEvents = req('/lib/server/client-connection/constants/events'),
	MessageParser          = req('/lib/server/message-parser'),
	Commands               = req('/constants/commands'),
	SourceTypes            = req('/constants/source-types'),
	UserDetails            = req('/lib/user-details'),
	ServerDetails          = req('/lib/server-details'),
	NotRegisteredMessage   = req('/lib/server/messages/not-registered');



// This is the starting numeric ID that inspircd uses, so...
var ID = 35025234602;


class ClientConnection extends Connection {

	constructor(socket) {
		super();

		this.id = ID++;

		this.modes = [ ];

		this.socket = socket;

		this.bindHandlers();
		this.bindToSocket();

		this.getUserDetails().setHostname(this.getIP());
	}

	bindHandlers() {
		this.handleSocketData  = this.handleSocketData.bind(this);
		this.handleSocketError = this.handleSocketError.bind(this);
		this.handleSocketClose = this.handleSocketClose.bind(this);
	}

	bindToSocket() {
		this.socket.on('data',  this.handleSocketData);
		this.socket.on('error', this.handleSocketError);
		this.socket.on('close', this.handleSocketClose);
	}

	handleSocketData(data) {
		var messages = data.toString('utf8').split('\r\n');

		messages.forEach(this.handleIncomingMessage, this);
	}

	handleIncomingMessage(message_string) {
		var message;

		try {
			message = MessageParser.parse(message_string);
		} catch (error) {
			this.emit(ClientConnectionEvents.MESSAGE_ERROR, error);
			return;
		}

		if (message === null) {
			return;
		}

		if (!this.hasRegistered()) {
			this.handlePreRegistrationMessage(message);
		}

		this.dispatchMessage(message);
	}

	dispatchMessage(message) {
		message.setUserDetails(this.getUserDetails());

		this.emit(ClientConnectionEvents.INCOMING_MESSAGE, message);
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

	handleSocketError(error) {
		this.emit(ClientConnectionEvents.CONNECTION_FAILURE, error);
	}

	handleSocketClose() {
		this.emit(ClientConnectionEvents.CONNECTION_END);
	}

	sendMessage(message) {
		message.setServerDetails(this.getServerDetails());

		if (message.hasReplyNumeric()) {
			message.addTarget(this.getUserDetails());
		}

		var serialized_message = message.serialize();

		if (this.shouldLogOutboundMessages()) {
			this.logOutboundMessage(serialized_message);
		}

		this.socket.write(serialized_message);
	}

	getUserDetails() {
		if (!this.user_details) {
			this.user_details = new UserDetails();

			let id = this.id.toString(16).toUpperCase();

			this.user_details.setPreregistrationId(id);
		}

		return this.user_details;
	}

	getServerDetails() {
		if (!this.server_details) {
			this.server_details = new ServerDetails();
		}

		return this.server_details;
	}

	setServerDetails(server_details) {
		this.server_details = server_details;

		this.getUserDetails().setServerName(server_details.getName());

		return this;
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

	getId() {
		return this.id;
	}

	getSourceType() {
		return SourceTypes.CLIENT;
	}

	isServer() {
		// Eventually we want to support servers-as-clients. Sigh.
		// TODO: Actually wire this up.
		return false;
	}

	getIP() {
		var ip = this.socket.remoteAddress;

		if (ip.indexOf('::ffff:') === 0) {
			ip = ip.slice(7);
		}

		return ip;
	}

	destroy() {
		this.socket.destroy();
		this.removeAllListeners();
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

module.exports = ClientConnection;
