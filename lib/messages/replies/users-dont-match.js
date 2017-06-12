
var
	extend        = req('/lib/utilities/extend'),
	ReplyMessage  = req('/lib/messages/reply'),
	ReplyNumerics = req('/lib/constants/reply-numerics');


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
	reply_numeric: ReplyNumerics.ERR_USERSDONTMATCH,
	body:          'Cannot change mode for other users'
});

module.exports = UsersDontMatchMessage;
