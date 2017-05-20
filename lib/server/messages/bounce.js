
var
	extend                 = req('/utilities/extend'),
	ServerMessage          = req('/lib/server/message'),
	ReplyNumerics          = req('/lib/constants/reply-numerics'),
	NotYetImplementedError = req('/lib/errors/not-yet-implemented');

class ServerBounceMessage extends ServerMessage {

	isFromServer() {
		return true;
	}

	serializeParams() {
		throw new NotYetImplementedError(
			'ServerBounceMessage::serializeParams()'
		);
	}

	applyParsedParams(middle_params, trailing_param) {
		throw new NotYetImplementedError(
			'ServerBounceMessage::applyParsedParams()'
		);

	}

}

extend(ServerBounceMessage.prototype, {

	reply_numeric: ReplyNumerics.RPL_BOUNCE

});

module.exports = ServerBounceMessage;
