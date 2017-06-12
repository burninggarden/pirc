
var
	extend        = req('/lib/utilities/extend'),
	ReplyMessage  = req('/lib/messages/reply'),
	ReplyNumerics = req('/lib/constants/reply-numerics');


class NoSuchMessage extends ReplyMessage {

	serializeParameters() {
		throw new Error('implement');
	}

	applyParsedParameters(middle_parameters, trailing_parameter) {
		throw new Error('implement');
	}

}

extend(NoSuchMessage.prototype, {
	bnf:           '<server name> :No such server',
	reply_numeric: ReplyNumerics.ERR_NOSUCHSERVER
});

module.exports = NoSuchMessage;
