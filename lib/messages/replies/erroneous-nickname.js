
var
	extend               = req('/lib/utilities/extend'),
	ReplyMessage         = req('/lib/messages/reply'),
	Replies              = req('/lib/constants/replies'),
	InvalidNicknameError = req('/lib/errors/invalid-nickname'),
	ErrorReasons         = req('/lib/constants/error-reasons'),
	NicknameValidator    = req('/lib/validators/nickname');


class ErroneousNicknameMessage extends ReplyMessage {

	getNickname() {
		return this.nickname;
	}

	setNickname(nickname) {
		this.nickname = nickname;
		return this;
	}

	getValuesForParameters() {
		return {
			desired_nickname: this.getNickname()
		};
	}

	setValuesFromParameters(parameters) {
		this.setNickname(parameters.get('desired_nickname'));
	}

	toError() {
		var
			error_reason = ErrorReasons.INVALID_CHARACTERS,
			nickname     = this.getNickname();

		try {
			NicknameValidator.validate(nickname);
		} catch (error) {
			error_reason = error.getReason();
		}

		return new InvalidNicknameError(nickname, error_reason);
	}

}

extend(ErroneousNicknameMessage.prototype, {

	reply:    Replies.ERR_ERRONEUSNICKNAME,
	abnf:     '<desired-nickname> " :Erroneous nickname"',
	nickname: null

});

module.exports = ErroneousNicknameMessage;
