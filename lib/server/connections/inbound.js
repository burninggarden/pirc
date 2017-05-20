
var
	Connection       = req('/lib/connection'),
	extend           = req('/lib/utilities/extend'),
	ServerDetails    = req('/lib/server-details'),
	BaseError        = req('/lib/errors/base'),
	MessageParser    = req('/lib/server/message-parser'),
	ErrorCodes       = req('/lib/constants/error-codes'),
	ErrorReasons     = req('/lib/constants/error-reasons'),
	ServiceDetails   = req('/lib/service-details'),
	ConnectionEvents = req('/lib/constants/connection-events');

var
	NeedMoreParamsMessage    = req('/lib/server/messages/need-more-params'),
	UnknownCommandMessage    = req('/lib/server/messages/unknown-command'),
	NoSuchChannelMessage     = req('/lib/server/messages/no-such-channel'),
	NoticeMessage            = req('/lib/server/messages/notice'),
	ErroneousNicknameMessage = req('/lib/server/messages/erroneous-nickname'),
	NoNicknameGivenMessage   = req('/lib/server/messages/no-nickname-given');

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

		return this.sendMessage(error.toMessage());
	}

	handleInvalidChannelParsingError(error) {
		var message = new NoSuchChannelMessage();

		message.setChannelName(error.getChannelName());

		return void this.sendMessage(message);
	}

	handleInvalidNickParsingError(error) {
		var message;

		if (error.getReason() === ErrorReasons.OMITTED) {
			message = new ErroneousNicknameMessage();
			message.setDesiredNick(error.getValue());
		} else {
			message = new NoNicknameGivenMessage();
		}

		return void this.sendMessage(message);
	}

	handleInvalidTargetParsingError(error) {
		if (error.getReason() === ErrorReasons.OMITTED) {
			// If an INVALID_TARGET error was thrown, and it was due to a
			// target not being specified, we should treat the error as if
			// it was actually of type NOT_ENOUGH_PARAMETERS, instead.
			return this.handleNotEnoughParametersParsingError(error);
		}
	}

	handleNotEnoughParametersParsingError(error) {
		var message = new NeedMoreParamsMessage();

		message.setAttemptedCommand(error.getCommand());

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
