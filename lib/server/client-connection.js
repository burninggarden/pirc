var
	extend                 = req('/utilities/extend'),
	EventEmitter           = require('events').EventEmitter,
	ClientConnectionEvents = req('/lib/server/client-connection/constants/events'),
	MessageParser          = req('/lib/server/message-parser'),
	Commands               = req('/constants/commands'),
	SourceTypes            = req('/constants/source-types'),
	ClientDetails          = req('/lib/client-details'),
	ServerDetails          = req('/lib/server-details');

var
	NotYetImplementedError = req('/lib/errors/not-yet-implemented');


var ID = 0;


class ClientConnection extends EventEmitter {

	constructor(socket) {
		super();

		this.id = ID++;

		this.modes = [ ];

		this.socket = socket;

		this.bindHandlers();
		this.bindToSocket();

		this.getClientDetails().setHostname(socket.remoteAddress);
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
		console.log(message_string);
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
			return this.handlePreRegistrationMessage(message);
		}

		this.dispatchMessage(message);
	}

	dispatchMessage(message) {
		message.setClientDetails(this.getClientDetails());

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
				throw new NotYetImplementedError(`
					Return notice message to the client indicating this
					command won't be processed until they are registered
				`);
		}
	}

	handlePreRegistrationNickMessage(message) {
		// Note that this duplicates functionality performed by the Nicks
		// service. This is necessary in order for response messages from
		// the server to this client during its eventual registration to be
		// generated successfully.
		this.getClientDetails().setNick(message.getDesiredNick());

		this.queueMessageUntilRegistration(message);
		this.setHasReceivedRegistrationNickMessage(true);
	}

	handlePreRegistrationUserMessage(message) {
		// Note that this duplicates functionality performed by the Users
		// service. This is necessary in order for response messages from
		// the server to this client during its eventual registration to be
		// generated successfully.
		var client_details = this.getClientDetails();

		client_details.setUsername(message.getUsername());
		client_details.setRealname(message.getRealname());

		this.queueMessageUntilRegistration(message);
		this.setHasReceivedRegistrationUserMessage(true);
	}

	handleSocketError(error) {
		throw new NotYetImplementedError();
	}

	handleSocketClose() {
		this.emit(ClientConnectionEvents.CONNECTION_END);
	}

	sendMessage(message) {
		message.setServerDetails(this.getServerDetails());

		if (message.hasReplyNumeric()) {
			message.addTarget(this.getClientDetails());
		}

		var serialized_message = message.serialize();

		console.log('>>' + serialized_message);

		this.socket.write(serialized_message);
	}

	getClientDetails() {
		if (!this.client_details) {
			this.client_details = new ClientDetails();
		}

		return this.client_details;
	}

	getServerDetails() {
		if (!this.server_details) {
			this.server_details = new ServerDetails();
		}

		return this.server_details;
	}

	setServerDetails(server_details) {
		this.server_details = server_details;
		return this;
	}

	/**
	 * @returns {boolean}
	 */
	hasRegistered() {
		return this.has_registered === true;
	}

	/**
	 * @returns {boolean}
	 */
	canRegister() {
		return (
			   this.hasReceivedRegistrationNickMessage()
			&& this.hasReceivedRegistrationUserMessage()
		);
	}

	/**
	 * @returns {self}
	 */
	register() {
		this.has_registered = true;
		this.emit(ClientConnectionEvents.REGISTER);
		this.dequeueMessagesFollowingRegistration();
		return this;
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

		if (this.canRegister()) {
			this.register();
		}

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

		if (this.canRegister()) {
			this.register();
		}

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

	destroy() {
		this.socket.destroy();
		this.removeAllListeners();
	}

}

extend(ClientConnection.prototype, {

	registration_user_message_received: false,
	registration_nick_message_received: false,

	has_registered:                     false,
	registration_message_queue:         null,

	client_details:                     null,
	server_details:                     null

});

module.exports = ClientConnection;
