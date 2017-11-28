var
	Net = require('net');

var
	defer        = require('./utility/defer'),
	extend       = require('./utility/extend'),
	isFunction   = require('./utility/is-function'),
	deferOrThrow = require('./utility/defer-or-throw');

var
	EventEmitter   = require('events').EventEmitter,
	Parser_Message = require('./parser/message'),
	CallbackList   = require('./callback-list'),
	Message        = require('./message');

var
	Enum_ConnectionEvents = require('./enum/connection-events'),
	Enum_Delimiters       = require('./enum/delimiters'),
	Enum_Replies          = require('./enum/replies'),
	Enum_ReplyNumerics    = require('./enum/reply-numerics');


var ID = 0;


class Connection extends EventEmitter {

	constructor() {
		super();

		this.id = ID++;

		this.bindSocketHandlers();
	}

	getId() {
		return this.id;
	}

	getSocket() {
		return this.socket;
	}

	/**
	 * @param   {Net.Socket|null} socket
	 * @returns {self}
	 */
	setSocket(socket) {
		this.socket = socket;

		if (socket) {
			this.coupleToSocket(socket);
		}

		return this;
	}

	bindSocketHandlers() {
		this.handleSocketData    = this.handleSocketData.bind(this);
		this.handleSocketConnect = this.handleSocketConnect.bind(this);
		this.handleSocketError   = this.handleSocketError.bind(this);
		this.handleSocketEnd     = this.handleSocketEnd.bind(this);
		this.handleSocketClose   = this.handleSocketClose.bind(this);
	}

	coupleToSocket(socket) {
		socket.on('data',    this.handleSocketData);
		socket.on('error',   this.handleSocketError);
		socket.on('close',   this.handleSocketClose);
		socket.on('connect', this.handleSocketConnect);
		socket.on('end',     this.handleSocketEnd);
	}

	decoupleFromSocket(socket) {
		socket.removeListener('data',    this.handleSocketData);
		socket.removeListener('connect', this.handleSocketConnect);
		socket.removeListener('error',   this.handleSocketError);
		socket.removeListener('end',     this.handleSocketEnd);
		socket.removeListener('close',   this.handleSocketClose);
	}

	shouldLogOutgoingMessages() {
		return this.log_outgoing_messages;
	}

	logOutgoingMessages() {
		return this.setLogOutgoingMessages(true);
	}

	setLogOutgoingMessages(log_outgoing_messages) {
		this.log_outgoing_messages = log_outgoing_messages;
		return this;
	}

	logOutgoingMessage(text) {
		text = this.trimRawMessage(text);

		if (text) {
			console.log(this.getOutgoingLogPrefix() + text);
		}
	}

	getOutgoingLogPrefix() {
		throw new Error('Implement method: getOutgoingLogPrefix()');
	}

	shouldLogIncomingMessages() {
		return this.log_incoming_messages;
	}

	logIncomingMessages() {
		return this.setLogIncomingMessages(true);
	}

	setLogIncomingMessages(log_incoming_messages) {
		this.log_incoming_messages = log_incoming_messages;
		return this;
	}

	logIncomingMessage(text) {
		text = this.trimRawMessage(text);

		if (text) {
			console.log(this.getIncomingLogPrefix() + text);
		}
	}

	getIncomingLogPrefix() {
		throw new Error('Implement method: getIncomingLogPrefix()');
	}

	trimRawMessage(text) {
		text = text.replace(/\n/g, '');
		text = text.trim();

		return text;
	}

	handleSocketConnect() {
		this.setIsConnected(true);
		this.setIsConnecting(false);
		this.setIsDisconnecting(false);
		this.emit(Enum_ConnectionEvents.CONNECTION_SUCCESS, this);
	}

	handleSocketError(error) {
		this.setIsConnected(false);
		this.setIsConnecting(false);
		this.setIsDisconnecting(false);
		this.emit(Enum_ConnectionEvents.CONNECTION_FAILURE, this, error);
	}

	handleSocketClose() {
		this.setIsConnected(false);
		this.setIsConnecting(false);
		this.setIsDisconnecting(false);
		this.decoupleFromSocket(this.getSocket());
		this.setSocket(null);
		this.getDisconnectCallbacks().dispatch(null);
	}

	handleSocketEnd() {
		this.setIsConnected(false);
		this.setIsConnecting(false);
		this.setIsDisconnecting(false);
		this.emit(Enum_ConnectionEvents.CONNECTION_END, this);
	}

	handleSocketData(data) {
		this.emit(Enum_ConnectionEvents.CONNECTION_DATA, this, data);

		var data_string = data.toString('utf8');

		if (this.hasIncomingMessageRemainder()) {
			data_string = this.getIncomingMessageRemainder() + data_string;
		}

		var index = data_string.indexOf(Enum_Delimiters.CRLF);

		while (index !== -1) {
			let message = data_string.slice(0, index + Enum_Delimiters.CRLF.length);

			if (message[0] === '\n') {
				message = message.slice(1);
			}

			// The following trim operation trims off the trailing carriage
			// return and newline, plus any additional trailing whitespace,
			// and then reintroduces the trailing CRLF delimiter to ensure
			// proper parsing.
			message = message.trim() + '\r\n';

			this.handleRawIncomingMessage(message);

			data_string = data_string.slice(index + Enum_Delimiters.CRLF.length);
			index = data_string.indexOf(Enum_Delimiters.CRLF);
		}

		if (data_string.length > 0) {
			this.setIncomingMessageRemainder(data_string);
		} else {
			this.clearIncomingMessageRemainder();
		}
	}

	handleRawIncomingMessage(message_string) {
		if (this.shouldLogIncomingMessages()) {
			this.logIncomingMessage(message_string);
		}

		var message;

		try {
			message = this.parseMessage(message_string);
			this.handleIncomingMessage(message);
		} catch (error) {
			return void this.handleError(error);
		}
	}

	parseMessage(message_string) {
		var
			parsed_abnf      = Parser_Message.parse(message_string),
			leader           = parsed_abnf.get('command'),
			prefix           = parsed_abnf.get('prefix'),
			parameter_string = parsed_abnf.get('params');

		// TODO: Clean up this hacky BS:
		if (leader === Enum_ReplyNumerics[Enum_Replies.RPL_BOUNCE]) {
			if (message_string.indexOf('Try') !== 0) {
				leader = Enum_Replies.RPL_ISUPPORT;
			}
		}

		return Message.fromLeader(leader)
			.setRawMessage(message_string)
			.setPrefix(prefix)
			.setParameterString(parameter_string);
	}

	handleError(error) {
		throw error;
	}

	handleIncomingMessage(message) {
		throw new Error('Implement method: handleIncomingMessage()');
	}

	handleIncomingMessageSafe(message) {
		try {
			this.handleIncomingMessage(message);
		} catch (error) {
			return this.handleError(error);
		}
	}

	/**
	 * @param   {Message} message
	 * @returns {void}
	 */
	sendMessageIfConnected(message) {
		if (this.isConnected()) {
			this.sendMessage(message);
		}
	}

	/**
	 * @param   {Message} message
	 * @returns {void}
	 */
	sendMessage(message) {
		if (!this.isConnected()) {
			throw new Error('Not connected');
		}

		try {
			this.write(message.serialize());
		} catch (error) {
			console.error(error);
		}

		return this;
	}

	sendRawMessage(raw_message) {
		if (!this.isConnected()) {
			throw new Error('Not connected');
		}

		if (raw_message.slice(-2) !== Enum_Delimiters.CRLF) {
			raw_message += Enum_Delimiters.CRLF;
		}

		this.write(raw_message);

		return this;
	}

	write(message) {
		var parts = message.split('\r\n').filter(function filter(part) {
			return part.length > 0;
		});

		if (this.shouldLogOutgoingMessages()) {
			this.logOutgoingMessage(parts.join(''));
		}

		this.emit(Enum_ConnectionEvents.OUTGOING_MESSAGE_START, this, message);

		this.socket.write(message, 'utf8', this.handleWriteComplete.bind(this));
	}

	handleWriteComplete(error) {
		if (error) {
			return;
		}

		this.emit(Enum_ConnectionEvents.OUTGOING_MESSAGE_END, this);
	}

	hasIncomingMessageRemainder() {
		return this.getIncomingMessageRemainder() !== null;
	}

	getIncomingMessageRemainder() {
		return this.incoming_message_remainder;
	}

	setIncomingMessageRemainder(message_remainder) {
		this.incoming_message_remainder = message_remainder;
	}

	clearIncomingMessageRemainder() {
		this.setIncomingMessageRemainder(null);
	}

	isConnected() {
		return this.is_connected;
	}

	setIsConnected(is_connected = true) {
		this.is_connected = is_connected;
		return this;
	}

	isDisconnected() {
		return !this.isConnected();
	}

	isDisconnecting() {
		return this.is_disconnecting;
	}

	setIsDisconnecting(is_disconnecting = true) {
		this.is_disconnecting = is_disconnecting;
		return this;
	}

	isConnecting() {
		return this.is_connecting;
	}

	setIsConnecting(is_connecting = true) {
		this.is_connecting = is_connecting;
		return this;
	}

	/**
	 * @returns {boolean}
	 */
	isRegistered() {
		return this.is_registered;
	}

	/**
	 * @param   {boolean} is_registered
	 * @returns {self}
	 */
	setIsRegistered(is_registered) {
		this.is_registered = is_registered;
		return this;
	}

	/**
	 * @returns {boolean}
	 */
	isRegistering() {
		return this.is_registering;
	}

	/**
	 * @param   {boolean} is_registering
	 * @returns {self}
	 */
	setIsRegistering(is_registering) {
		return this.is_registering;
	}

	connect(parameters, callback) {
		if (!isFunction(callback)) {
			throw new Error('Must supply a valid callback');
		}

		if (this.isConnected()) {
			let error = new Error('Already connected');

			return void defer(callback, error);
		}

		this.setIsConnecting(true);

		var socket = Net.createConnection(parameters);

		this.setSocket(socket);

		function handleSuccess() {
			this.removeListener(
				Enum_ConnectionEvents.CONNECTION_FAILURE,
				handleFailure
			);

			return void callback(null, this);
		}

		function handleFailure(connection, error) {
			this.removeListener(
				Enum_ConnectionEvents.CONNECTION_SUCCESS,
				handleSuccess
			);

			return void callback(error);
		}

		this.once(Enum_ConnectionEvents.CONNECTION_SUCCESS, handleSuccess);
		this.once(Enum_ConnectionEvents.CONNECTION_FAILURE, handleFailure);
	}

	disconnectSafe(callback) {
		if (this.isDisconnected()) {
			return void callback(null);
		}

		return this.disconnect(callback);
	}

	disconnect(callback) {
		if (this.isDisconnected()) {
			let error = new Error('Socket was already closed');

			return void deferOrThrow(callback, error);
		}

		if (isFunction(callback)) {
			this.getDisconnectCallbacks().add(callback);
		}

		if (this.isDisconnecting()) {
			return;
		}

		this.setIsDisconnecting(true);

		var socket = this.getSocket();

		socket.end();
		socket.unref();
	}

	getDisconnectCallbacks() {
		if (!this.disconnect_callbacks) {
			this.disconnect_callbacks = new CallbackList();
		}

		return this.disconnect_callbacks;
	}

	/**
	 * @param   {function} callback
	 * @returns {void}
	 */
	addDisconnectCallback(callback) {
		this.getDisconnectCallbacks().add(callback);
	}

}

extend(Connection.prototype, {

	id:                         null,

	socket:                     null,

	is_connected:               false,
	is_connecting:              false,
	is_disconnecting:           false,

	log_incoming_messages:      false,
	log_outgoing_messages:      false,

	incoming_message_remainder: null,


	disconnect_callbacks:       null

});

module.exports = Connection;
