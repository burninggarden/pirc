
var
	extend       = req('/lib/utilities/extend'),
	ReplyMessage = req('/lib/messages/reply'),
	Replies      = req('/lib/constants/replies');


class UsersDontMatchMessage extends ReplyMessage {

	serializeParameters() {
		var
			targets = this.serializeTargets(),
			body    = this.getBody();

		return `${targets} :${body}`;
	}

	applyParsedParameters(middle_parameters, trailing_parameter) {
		this.addTargetFromString(middle_parameters.shift());
		this.setBody(trailing_parameter);
	}

}

extend(UsersDontMatchMessage.prototype, {
	reply: Replies.ERR_USERSDONTMATCH,
	body:  'Cannot change mode for other users'
});

module.exports = UsersDontMatchMessage;
