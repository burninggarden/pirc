
var
	extend                 = req('/lib/utilities/extend'),
	ReplyMessage           = req('/lib/messages/reply'),
	ReplyNumerics          = req('/lib/constants/reply-numerics'),
	NotYetImplementedError = req('/lib/errors/not-yet-implemented');

class BounceMessage extends ReplyMessage {

	isFrom() {
		return true;
	}

	serializeParameters() {
		throw new NotYetImplementedError(
			'BounceMessage::serializeParameters()'
		);
	}

	applyParsedParameters() {
		throw new NotYetImplementedError(
			'BounceMessage::applyParsedParameters()'
		);

	}

}

extend(BounceMessage.prototype, {

	reply_numeric: ReplyNumerics.RPL_BOUNCE

});

module.exports = BounceMessage;
