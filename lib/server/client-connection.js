var
	extend                 = req('/utilities/extend'),
	EventEmitter           = require('events').EventEmitter,
	ClientConnectionEvents = req('/lib/server/client-connection/constants/events'),
	MessageParser          = req('/lib/server/message-parser'),
	Commands               = req('/constants/commands'),
	NickTarget             = req('/lib/targets/nick');

var
	NotYetImplementedError = req('/lib/errors/not-yet-implemented');

var
	NickValidator       = req('/validators/nick'),
	RealnameValidator   = req('/validators/realname'),
	UsernameValidator   = req('/validators/username'),
	ServerNameValidator = req('/validators/server-name'),
	HostnameValidator   = req('/validators/hostname');


var ID = 0;


class ClientConnection extends EventEmitter {

	constructor(socket) {
		super();

		this.id = ID++;

		this.modes = [ ];

		this.socket = socket;

		this.bindHandlers();
		this.bindToSocket();
		this.setHostname(socket.remoteAddress);
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
			return this.handlePreRegistrationMessage(message);
		}

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
		this.setNick(message.getDesiredNick());

		this.queueMessageUntilRegistration(message);
		this.setHasReceivedRegistrationNickMessage(true);
	}

	handlePreRegistrationUserMessage(message) {
		// Note that this duplicates functionality performed by the Users
		// service. This is necessary in order for response messages from
		// the server to this client during its eventual registration to be
		// generated successfully.
		this.setUsername(message.getUsername());
		this.setRealname(message.getRealname());

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
		message.setServerName(this.getServerName());

		if (message.hasReplyNumeric() && !message.hasTarget(this.toTarget())) {
			message.addTarget(this.toTarget());
		}

		this.socket.write(message.serialize());
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

		queue.forEach(function each(message) {
			this.emit(ClientConnectionEvents.INCOMING_MESSAGE, message);
		}, this);

		return this;
	}

	getId() {
		return this.id;
	}

	toTarget() {
		if (this.hasNick()) {
			return new NickTarget(this.getNick());
		} else {
			throw new NotYetImplementedError(`
				Generating target from user without nick
			`);
		}
	}

	hasNick() {
		return this.nick !== null;
	}

	getNick() {
		NickValidator.validate(this.nick);
		return this.nick;
	}

	setNick(nick) {
		NickValidator.validate(nick);
		this.nick = nick;
		return this;
	}

	hasUsername() {
		return this.username !== null;
	}

	getUsername() {
		UsernameValidator.validate(this.username);
		return this.username;
	}

	setUsername(username) {
		UsernameValidator.validate(username);
		this.username = username;
		return this;
	}

	hasRealname() {
		return this.realname !== null;
	}

	getRealname() {
		RealnameValidator.validate(this.realname);
		return this.realname;
	}

	setRealname(realname) {
		RealnameValidator.validate(realname);
		this.realname = realname;
		return this;
	}

	hasServerName() {
		return this.server_name !== null;
	}

	getServerName(server_name) {
		ServerNameValidator.validate(this.server_name);
		return this.server_name;
	}

	setServerName(server_name) {
		ServerNameValidator.validate(server_name);
		this.server_name = server_name;
		return this;
	}

	hasHostname() {
		return this.hostname !== null;
	}

	getHostname() {
		HostnameValidator.validate(this.hostname);
		return this.hostname;
	}

	setHostname(hostname) {
		HostnameValidator.validate(hostname);
		this.hostname = hostname;
		return this;
	}

	getAddress() {
		return this.getUsername() + '@' + this.getHostname();
	}

	addMode(mode) {
		this.modes.push(mode);
		return this;
	}

	isServer() {
		// Eventually we want to support servers-as-clients. Sigh.
		// TODO: Actually wire this up.
		return false;
	}

	destroy() {
		this.socket.destroy();
	}

}

extend(ClientConnection.prototype, {

	nick:                               null,
	username:                           null,
	realname:                           null,
	modes:                              null,
	server_name:                        null,

	registration_user_message_received: false,
	registration_nick_message_received: false,

	has_registered:                     false,
	registration_message_queue:         null

});

module.exports = ClientConnection;
