
var
	extend        = req('/lib/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ReplyNumerics = req('/lib/constants/reply-numerics');


class UsersDontMatchMessage extends ServerMessage {

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
