
var
	extend           = req('/utilities/extend'),
	ServerMessage    = req('/lib/server/message'),
	ReplyNumerics    = req('/constants/reply-numerics'),
	InvalidNickError = req('/lib/errors/invalid-nick'),
	ErrorReasons     = req('/constants/error-reasons');


class NoNicknameGivenMessage extends ServerMessage {

	applyParsedParams(middle_params, trailing_param) {
		this.addTargetFromString(middle_params.shift());
		this.setBody(trailing_param);
	}

	serializeParams() {
		var
			targets = this.serializeTargets(),
			body    = this.getBody();

		return `${targets} :${body}`;
	}

	toError() {
		return new InvalidNickError(
			undefined,
			ErrorReasons.OMITTED
		);
	}

}

extend(NoNicknameGivenMessage.prototype, {

	reply_numeric: ReplyNumerics.ERR_NONICKNAMEGIVEN,
	body:          'No nickname given'

});

module.exports = NoNicknameGivenMessage;
