
var
	Connection       = req('/lib/connection'),
	extend           = req('/utilities/extend'),
	ServerDetails    = req('/lib/server-details'),
	BaseError        = req('/lib/errors/base'),
	MessageParser    = req('/lib/server/message-parser'),
	ErrorCodes       = req('/constants/error-codes'),
	ErrorReasons     = req('/constants/error-reasons'),
	ServiceDetails   = req('/lib/service-details'),
	ConnectionEvents = req('/constants/connection-events');

var
	NeedMoreParamsMessage = req('/lib/server/messages/need-more-params'),
	NoticeMessage         = req('/lib/server/messages/notice');

var
	AbstractMethodNotImplementedError = req('/lib/errors/abstract-method-not-implemented');


// This is the starting numeric ID that InspIRCd uses, so...
var ID = 35025234602;


class InboundConnection extends Connection {

	constructor(socket) {
		super();

		this.id     = ID++;
		this.socket = socket;

		this.bindHandlers();
		this.coupleToSocket();
	}

	getSocket() {
		return this.socket;
	}

	bindHandlers() {
		this.handleSocketData  = this.handleSocketData.bind(this);
		this.handleSocketError = this.handleSocketError.bind(this);
		this.handleSocketClose = this.handleSocketClose.bind(this);
	}

	coupleToSocket() {
		var socket = this.getSocket();

		socket.on('data',  this.handleSocketData);
		socket.on('error', this.handleSocketError);
		socket.on('close', this.handleSocketClose);
	}

	decoupleFromSocket() {
		var socket = this.getSocket();

		socket.removeListener('data', this.handleSocketData);
		socket.removeListener('error', this.handleSocketError);
		socket.removeListener('close', this.handleSocketClose);
	}

	handleSocketData(data) {
		var messages = data.toString('utf8').split('\r\n');

		messages.forEach(this.handleRawInboundMessage, this);
	}

	handleSocketError(error) {
		this.emit(ConnectionEvents.CONNECTION_FAILURE, error);
	}

	handleSocketClose() {
		this.emit(ConnectionEvents.CONNECTION_END);
	}

	handleRawInboundMessage(message_string) {
		if (this.shouldLogInboundMessages()) {
			this.logInboundMessage(message_string);
		}

		var message;

		try {
			message = MessageParser.parse(message_string);
		} catch (error) {
			return void this.handleInboundMessageParsingError(error);
		}

		if (message === null) {
			return;
		}

		message.setLocalServerDetails(this.getLocalServerDetails());

		this.handleInboundMessage(message);
	}

	handleInboundMessage(message) {
		throw new AbstractMethodNotImplementedError('handleInboundMessage()');
	}

	handleInboundMessageParsingError(error) {
		if (!(error instanceof BaseError)) {
			throw error;
		}

		var
			code   = error.getCode(),
			reason = error.getReason();

		if (
			   code   === ErrorCodes.INVALID_TARGET
			&& reason === ErrorReasons.OMITTED
		) {
			// If an INVALID_TARGET error was thrown, and it was due to a
			// target not being specified, we should treat the error as if
			// it was actually of type NOT_ENOUGH_PARAMETERS, instead.
			code = ErrorCodes.NOT_ENOUGH_PARAMETERS;
		}

		if (code === ErrorCodes.NOT_ENOUGH_PARAMETERS) {
			let message = new NeedMoreParamsMessage();

			message.setAttemptedCommand(error.getCommand());

			return void this.sendMessage(message);
		}

		var message = new NoticeMessage();

		message.setBody(error.getMessage());

		var service_details = ServiceDetails.fromName('Core');

		message.addTarget(service_details);

		return void this.sendMessage(message);
	}

	getLocalServerDetails() {
		if (!this.local_server_details) {
			this.local_server_details = new ServerDetails();
		}

		return this.local_server_details;
	}

	setLocalServerDetails(server_details) {
		this.local_server_details = server_details;

		return this;
	}

	sendMessage(message) {
		message.setLocalServerDetails(this.getLocalServerDetails());

		var serialized_message = message.serialize();

		if (this.shouldLogOutboundMessages()) {
			this.logOutboundMessage(serialized_message);
		}

		this.getSocket().write(serialized_message);
	}

	getId() {
		return this.id;
	}

	getSourceType() {
		throw new AbstractMethodNotImplementedError('getSourceType()');
	}

	destroy() {
		this.getSocket().destroy();
	}

}

extend(InboundConnection.prototype, {

	id:                   null,
	socket:               null,
	local_server_details: null

});

module.exports = InboundConnection;
