
var
	extend           = req('/lib/utilities/extend'),
	ReplyMessage     = req('/lib/messages/reply'),
	Replies          = req('/lib/constants/replies'),
	InvalidNickError = req('/lib/errors/invalid-nick'),
	ErrorReasons     = req('/lib/constants/error-reasons'),
	NickValidator    = req('/lib/validators/nick');


class ErroneousNicknameMessage extends ReplyMessage {

	getValuesForParameters() {
		return {
			nick: this.getNick()
		};
	}

	setValuesFromParameters(parameters) {
		this.setNick(parameters.get('nick'));
	}

	toError() {
		var
			error_reason = ErrorReasons.INVALID_CHARACTERS,
			nick         = this.nick();

		try {
			NickValidator.validate(nick);
		} catch (error) {
			error_reason = error.getReason();
		}

		return new InvalidNickError(nick, error_reason);
	}

}

extend(ErroneousNicknameMessage.prototype, {

	reply: Replies.ERR_ERRONEUSNICKNAME

});

module.exports = ErroneousNicknameMessage;
