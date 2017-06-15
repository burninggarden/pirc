
var
	extend       = req('/lib/utilities/extend'),
	ReplyMessage = req('/lib/messages/reply'),
	Replies      = req('/lib/constants/replies');


class NoSuchMessage extends ReplyMessage {

	serializeParameters() {
		throw new Error('implement');
	}

	applyParsedParameters(middle_parameters, trailing_parameter) {
		throw new Error('implement');
	}

}

extend(NoSuchMessage.prototype, {
	reply: Replies.ERR_NOSUCHSERVER
});

module.exports = NoSuchMessage;
