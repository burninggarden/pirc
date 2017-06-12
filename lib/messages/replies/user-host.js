
var
	extend        = req('/lib/utilities/extend'),
	ReplyMessage  = req('/lib/messages/reply'),
	ReplyNumerics = req('/lib/constants/reply-numerics');

class UserHostMessage extends ReplyMessage {

	applyParsedParameters(middle_parameters, trailing_parameter) {
	}

	serializeParameters() {
	}

}

extend(UserHostMessage.prototype, {

	reply_numeric: ReplyNumerics.RPL_USERHOST,
	bnf:           ':*1<reply> *( " " <reply> )'

});

module.exports = UserHostMessage;
