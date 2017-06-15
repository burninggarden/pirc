
var
	extend                 = req('/lib/utilities/extend'),
	ReplyMessage           = req('/lib/messages/reply'),
	Replies                = req('/lib/constants/replies'),
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

	reply: Replies.RPL_BOUNCE

});

module.exports = BounceMessage;
