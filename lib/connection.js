
var
	EventEmitter     = require('events').EventEmitter,
	ConnectionEvents = req('/lib/constants/connection-events'),
	Delimiters       = req('/lib/constants/delimiters'),
	extend           = req('/lib/utilities/extend'),
	createMessage    = req('/lib/utilities/create-message'),
	MessageParser    = req('/lib/parsers/message'),
	Replies          = req('/lib/constants/replies'),
	ReplyNumerics    = req('/lib/constants/reply-numerics');


var
	NotConnectedError                 = req('/lib/errors/not-connected'),
	AbstractMethodNotImplementedError = req('/lib/errors/abstract-method-not-implemented');

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

		this.coupleToSocket(socket);

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
		// return this.log_outbound_messages;
		return true;
	}

	logOutboundMessages() {
		this.log_outbound_messages = true;
	}

	logOutboundMessage(text) {
		text = this.trimRawMessage(text);

		if (text) {
			console.log(this.getOutboundLogPrefix() + text);
		}
	}

	getOutboundLogPrefix() {
		throw new AbstractMethodNotImplementedError('getOutboundLogPrefix()');
	}

	shouldLogInboundMessages() {
		// return this.log_inbound_messages;
		return true;
	}

	logInboundMessages() {
		this.log_inbound_messages = true;
	}

	logInboundMessage(text) {
		text = this.trimRawMessage(text);

		if (text) {
			console.log(this.getInboundLogPrefix() + text);
		}
	}

	getInboundLogPrefix() {
		throw new AbstractMethodNotImplementedError('getInboundLogPrefix()');
	}

	trimRawMessage(text) {
		text = text.replace(/\n/g, '');
		text = text.trim();

		return text;
	}

	handleSocketConnect() {
		this.setIsConnected(true);
		this.emit(ConnectionEvents.CONNECTION_SUCCESS);
	}

	handleSocketError(error) {
		this.emit(ConnectionEvents.CONNECTION_FAILURE, error);
	}

	handleSocketClose() {
		this.emit(ConnectionEvents.CONNECTION_END);
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
		} catch (error) {
			/*
			let command = MessageParser.getCommandForMessage(message_string);

			if (command && error instanceof BaseError) {
				error.setCommand(command);
			}
			*/

			return void this.handleInboundMessageParsingError(error);
		}

		if (message === null) {
			return;
		}

		this.handleInboundMessage(message);
	}

	parseMessage(message_string) {
		let parsed_abnf = MessageParser.parse(message_string);

		if (!parsed_abnf) {
			throw this.determineErrorForUnparseableMessage(
				message_string
			);
		}

		var
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

	handleInboundMessageParsingError(error) {
		throw new AbstractMethodNotImplementedError(
			'handleInboundMessageParsingError()'
		);
	}

	handleInboundMessage(message) {
		throw new AbstractMethodNotImplementedError('handleInboundMessage()');
	}

	handleSocketEnd() {
		this.setIsConnected(false);
		this.unbindSocketEvents();
		this.emit(ConnectionEvents.CONNECTION_END);
	}

	handleSocketClose() {
		this.handleSocketEnd();
	}

	sendMessage(message) {
		if (!this.isConnected()) {
			throw new NotConnectedError();
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
		return this.connected === true;
	}

	setIsConnected(is_connected) {
		this.connected = is_connected;
		return this;
	}

}

extend(Connection.prototype, {

	id:                        null,

	socket:                    null,

	connected:                 false,

	log_inbound_messages:      false,
	log_outbound_messages:     false,

	inbound_message_remainder: null

});

module.exports = Connection;
