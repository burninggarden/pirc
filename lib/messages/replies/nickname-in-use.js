
var
	extend               = req('/lib/utilities/extend'),
	ReplyMessage         = req('/lib/messages/reply'),
	Replies              = req('/lib/constants/replies'),
	InvalidNicknameError = req('/lib/errors/invalid-nickname'),
	ErrorReasons         = req('/lib/constants/error-reasons');


class NicknameInUseMessage extends ReplyMessage {

	getValuesForParameters() {
		return {
			nickname: this.getNickname()
		};
	}

	setValuesFromParameters(parameters) {
		this.setNickname(parameters.get('nickname'));
	}

	toError() {
		return new InvalidNicknameError(
			this.getNickname(),
			ErrorReasons.ALREADY_IN_USE
		);
	}

}

extend(NicknameInUseMessage.prototype, {

	reply: Replies.ERR_NICKNAMEINUSE

});

module.exports = NicknameInUseMessage;
