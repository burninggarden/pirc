
var
	extend = req('/lib/utilities/extend'),
	add    = req('/lib/utilities/add');

var
	EventEmitter     = require('events').EventEmitter,
	ConnectionEvents = req('/lib/constants/connection-events'),
	Delimiters       = req('/lib/constants/delimiters'),
	createMessage    = req('/lib/utilities/create-message'),
	MessageParser    = req('/lib/parsers/message'),
	Replies          = req('/lib/constants/replies'),
	ReplyNumerics    = req('/lib/constants/reply-numerics');


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

	shouldLogOutboundMessages() {
		return this.log_outbound_messages;
	}

	logOutboundMessages() {
		return this.setLogOutboundMessages(true);
	}

	setLogOutboundMessages(log_outbound_messages) {
		this.log_outbound_messages = log_outbound_messages;
		return this;
	}

	logOutboundMessage(text) {
		text = this.trimRawMessage(text);

		if (text) {
			console.log(this.getOutboundLogPrefix() + text);
		}
	}

	getOutboundLogPrefix() {
		throw new Error('Implement method: getOutboundLogPrefix()');
	}

	shouldLogInboundMessages() {
		return this.log_inbound_messages;
	}

	logInboundMessages() {
		return this.setLogInboundMessages(true);
	}

	setLogInboundMessages(log_inbound_messages) {
		this.log_inbound_messages = log_inbound_messages;
		return this;
	}

	logInboundMessage(text) {
		text = this.trimRawMessage(text);

		if (text) {
			console.log(this.getInboundLogPrefix() + text);
		}
	}

	getInboundLogPrefix() {
		throw new Error('Implement method: getInboundLogPrefix()');
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
		this.emit(ConnectionEvents.CONNECTION_SUCCESS);
	}

	handleSocketError(error) {
		this.setIsConnected(false);
		this.setIsConnecting(false);
		this.setIsDisconnecting(false);
		this.emit(ConnectionEvents.CONNECTION_FAILURE, error);
	}

	handleSocketClose() {
		this.setIsConnected(false);
		this.setIsConnecting(false);
		this.setIsDisconnecting(false);
		this.decoupleFromSocket(this.getSocket());
		this.setSocket(null);
		this.dispatchDisconnectCallbacks(null);
	}

	handleSocketData(data) {
		this.emit(ConnectionEvents.CONNECTION_DATA, data);

		var data_string = data.toString('utf8');

		if (this.hasInboundMessageRemainder()) {
			data_string = this.getInboundMessageRemainder() + data_string;
		}

		var index = data_string.indexOf(Delimiters.CRLF);

		while (index !== -1) {
			let message = data_string.slice(0, index + Delimiters.CRLF.length);

			if (message[0] === '\n') {
				message = message.slice(1);
			}

			// The following trim operation trims off the trailing carriage
			// return and newline, plus any additional trailing whitespace,
			// and then reintroduces the trailing CRLF delimiter to ensure
			// proper parsing.
			message = message.trim() + '\r\n';

			this.handleRawInboundMessage(message);

			data_string = data_string.slice(index + Delimiters.CRLF.length);
			index = data_string.indexOf(Delimiters.CRLF);
		}

		if (data_string.length > 0) {
			this.setInboundMessageRemainder(data_string);
		} else {
			this.clearInboundMessageRemainder();
		}
	}

	handleRawInboundMessage(message_string) {
		if (this.shouldLogInboundMessages()) {
			this.logInboundMessage(message_string);
		}

		var message;

		try {
			message = this.parseMessage(message_string);
			this.handleInboundMessage(message);
		} catch (error) {
			return void this.handleError(error);
		}
	}

	parseMessage(message_string) {
		var
			parsed_abnf      = MessageParser.parse(message_string),
			command          = parsed_abnf.get('command'),
			prefix           = parsed_abnf.get('prefix'),
			parameter_string = parsed_abnf.get('params');

		// TODO: Clean up this hacky BS:
		if (command === ReplyNumerics[Replies.RPL_BOUNCE]) {
			if (message_string.indexOf('Try') !== 0) {
				command = Replies.RPL_ISUPPORT;
			}
		}

		return createMessage(command)
			.setRawMessage(message_string)
			.setPrefix(prefix)
			.setParameterString(parameter_string);
	}

	handleError(error) {
		throw error;
	}

	handleInboundMessage(message) {
		throw new Error('Implement method: handleInboundMessage()');
	}

	handleInboundMessageSafe(message) {
		try {
			this.handleInboundMessage(message);
		} catch (error) {
			return this.handleError(error);
		}
	}

	handleSocketEnd() {
		this.setIsConnected(false);
		this.setIsConnecting(false);
		this.setIsDisconnecting(false);
		this.emit(ConnectionEvents.CONNECTION_END);
	}

	sendMessage(message) {
		if (!this.isConnected()) {
			throw new Error('Not connected');
		}

		try {
			this.write(message.serialize());
		} catch (error) {
			throw error;
		}
	}

	write(message) {
		var parts = message.split('\r\n').filter(function filter(part) {
			return part.length > 0;
		});

		if (this.shouldLogOutboundMessages()) {
			this.logOutboundMessage(parts.join(''));
		}

		this.socket.write(message);
	}

	hasInboundMessageRemainder() {
		return this.getInboundMessageRemainder() !== null;
	}

	getInboundMessageRemainder() {
		return this.inbound_message_remainder;
	}

	setInboundMessageRemainder(message_remainder) {
		this.inbound_message_remainder = message_remainder;
	}

	clearInboundMessageRemainder() {
		this.setInboundMessageRemainder(null);
	}

	isConnected() {
		return this.is_connected === true;
	}

	setIsConnected(is_connected) {
		this.is_connected = is_connected;
		return this;
	}

	isDisconnected() {
		return !this.isConnected();
	}

	isDisconnecting() {
		return this.is_disconnecting;
	}

	setIsDisconnecting(is_disconnecting) {
		this.is_disconnecting = true;
		return this;
	}

	isConnecting() {
		return this.is_connecting;
	}

	setIsConnecting(is_connecting) {
		this.is_connecting = is_connecting;
		return this;
	}

	disconnect(callback) {
		if (this.isDisconnected()) {
			let error = new Error('Socket was already closed');

			return void callback(error);
		}

		this.addDisconnectCallback(callback);

		if (this.isDisconnecting()) {
			return;
		}

		this.setIsDisconnecting(true);

		var socket = this.getSocket();

		socket.end();
		socket.unref();
	}

	addDisconnectCallback(callback) {
		add(callback).to(this.getDisconnectCallbacks());
	}

	getDisconnectCallbacks() {
		if (!this.disconnect_callbacks) {
			this.disconnect_callbacks = [ ];
		}

		return this.disconnect_callbacks;
	}

	dispatchDisconnectCallbacks(error) {
		this.getDisconnectCallbacks().forEach(function each(callback) {
			callback(error);
		});
	}

}

extend(Connection.prototype, {

	id:                        null,

	socket:                    null,

	is_connected:              false,
	is_connecting:             false,
	is_disconnecting:          false,

	log_inbound_messages:      false,
	log_outbound_messages:     false,

	inbound_message_remainder: null,


	disconnect_callbacks:      null

});

module.exports = Connection;
