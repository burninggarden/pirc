
var
	extend                 = req('/lib/utilities/extend'),
	ServerMessage          = req('/lib/server/message'),
	ReplyNumerics          = req('/lib/constants/reply-numerics'),
	NotYetImplementedError = req('/lib/errors/not-yet-implemented');

class ServerBounceMessage extends ServerMessage {

	isFromServer() {
		return true;
	}

	serializeParameters() {
		throw new NotYetImplementedError(
			'ServerBounceMessage::serializeParameters()'
		);
	}

	applyParsedParameters() {
		throw new NotYetImplementedError(
			'ServerBounceMessage::applyParsedParameters()'
		);

	}

}

extend(ServerBounceMessage.prototype, {

	reply_numeric: ReplyNumerics.RPL_BOUNCE

});

module.exports = ServerBounceMessage;
