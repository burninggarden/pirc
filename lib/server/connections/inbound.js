
var
	Connection    = req('/lib/connection'),
	extend        = req('/lib/utilities/extend'),
	ServerDetails = req('/lib/server-details'),
	BaseError     = req('/lib/errors/base'),
	ErrorReasons  = req('/lib/constants/error-reasons'),
	TextFormatter = req('/lib/utilities/text-formatter');

var
	NeedMoreParametersMessage = req('/lib/messages/replies/need-more-parameters'),
	NoSuchChannelMessage      = req('/lib/messages/replies/no-such-channel'),
	ErroneousNicknameMessage  = req('/lib/messages/replies/erroneous-nickname'),
	NoNicknameGivenMessage    = req('/lib/messages/replies/no-nickname-given');

var
	AbstractMethodNotImplementedError = req('/lib/errors/abstract-method-not-implemented');


class InboundConnection extends Connection {

	constructor(socket) {
		super();

		this.setSocket(socket);
		this.setIsConnected(true);
	}

	handleInboundMessageParsingError(error) {
		if (!(error instanceof BaseError)) {
			throw error;
		}

		return this.sendMessage(error.toReply());
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
			message.setNick(error.getValue());
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
		var message = new NeedMoreParametersMessage();

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
		if (!message.hasOriginUser()) {
			message.setOriginServerDetails(this.getLocalServerDetails());
		}

		return super.sendMessage(message);
	}



	getSourceType() {
		throw new AbstractMethodNotImplementedError('getSourceType()');
	}

	destroy() {
		this.getSocket().destroy();
	}

	getOutboundLogPrefix() {
		return TextFormatter.blue('[S] SEND: ');
	}

	getInboundLogPrefix() {
		return TextFormatter.magenta('[S] RECV: ');
	}

}

extend(InboundConnection.prototype, {

	local_server_details: null

});

module.exports = InboundConnection;
