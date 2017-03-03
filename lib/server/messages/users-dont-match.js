
var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ReplyNumerics = req('/constants/reply-numerics');


class UsersDontMatchMessage extends ServerMessage {

	serializeParams() {
		var
			targets = this.serializeTargets(),
			body    = this.getBody();

		return `${targets} :${body}`;
	}

	applyParsedParams(middle_params, trailing_param) {
		this.addTargetFromString(middle_params.shift());
		this.setBody(trailing_param);
	}

}

extend(UsersDontMatchMessage.prototype, {
	reply_numeric: ReplyNumerics.ERR_USERSDONTMATCH,
	body:          'Cannot change mode for other users'
});

module.exports = UsersDontMatchMessage;
