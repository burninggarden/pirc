
var
	extend           = req('/lib/utilities/extend'),
	ServerMessage    = req('/lib/server/message'),
	ReplyNumerics    = req('/lib/constants/reply-numerics'),
	InvalidNickError = req('/lib/errors/invalid-nick'),
	ErrorReasons     = req('/lib/constants/error-reasons'),
	NickValidator    = req('/validators/nick');


class ErroneousNicknameMessage extends ServerMessage {

	getDesiredNick() {
		return this.nick;
	}

	setDesiredNick(nick) {
		// NOTICE: No validation happens here, since it's likely the supplied
		// nick wouldn't pass a validation call anyway (invalid characters).
		this.nick = nick;
	}

	applyParsedParams(middle_params, trailing_param) {
		this.addTargetFromString(middle_params.shift());
		this.setDesiredNick(middle_params.shift());
		this.setBody(trailing_param);
	}

	serializeParams() {
		var
			targets = this.serializeTargets(),
			nick    = this.getDesiredNick(),
			body    = this.getBody();

		return `${targets} ${nick} :${body}`;
	}

	toError() {
		var
			error_reason = ErrorReasons.INVALID_CHARACTERS,
			desired_nick = this.getDesiredNick();

		try {
			NickValidator.validate(desired_nick);
		} catch (error) {
			error_reason = error.getReason();
		}

		return new InvalidNickError(desired_nick, error_reason);
	}

}

extend(ErroneousNicknameMessage.prototype, {

	reply_numeric: ReplyNumerics.ERR_ERRONEUSNICKNAME,
	nick:          null,
	body:          'Erroneous Nickname'

});

module.exports = ErroneousNicknameMessage;
