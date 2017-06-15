
var
	extend       = req('/lib/utilities/extend'),
	ReplyMessage = req('/lib/messages/reply'),
	Replies      = req('/lib/constants/replies');

class UserHostMessage extends ReplyMessage {

	applyParsedParameters(middle_parameters, trailing_parameter) {
	}

	serializeParameters() {
	}

}

extend(UserHostMessage.prototype, {

	reply: Replies.RPL_USERHOST

});

module.exports = UserHostMessage;
