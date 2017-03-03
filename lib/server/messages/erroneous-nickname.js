
var
	extend           = req('/utilities/extend'),
	ServerMessage    = req('/lib/server/message'),
	ReplyNumerics    = req('/constants/reply-numerics'),
	InvalidNickError = req('/lib/errors/invalid-nick'),
	ErrorReasons     = req('/constants/error-reasons'),
	NickValidator    = req('/validators/nick');


class ErroneousNicknameMessage extends ServerMessage {

	getNick() {
		return this.nick;
	}

	setNick(nick) {
		// NOTICE: No validation happens here, since it's likely the supplied
		// nick wouldn't pass a validation call anyway (invalid characters).
		this.nick = nick;
	}

	applyParsedParams(middle_params, trailing_param) {
		// The desired nick is returned as the last middle parameter:
		this.setNick(middle_params.pop());

		this.setBody(trailing_param);
	}

	serializeParams() {
		var
			nick = this.getNick(),
			body = this.getBody();

		return `${nick} :${body}`;
	}

	toError() {
		var error_reason = ErrorReasons.INVALID_CHARACTERS;

		try {
			NickValidator.validate(this.getNick());
		} catch (error) {
			error_reason = error.getReason();
		}

		return new InvalidNickError(
			this.getNick(),
			error_reason
		);
	}

}

extend(ErroneousNicknameMessage.prototype, {

	reply_numeric: ReplyNumerics.ERR_ERRONEUSNICKNAME,
	nick:          null,
	body:          'Erroneous Nickname'

});

module.exports = ErroneousNicknameMessage;
