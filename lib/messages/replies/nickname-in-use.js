
var
	extend           = req('/lib/utilities/extend'),
	ReplyMessage     = req('/lib/messages/reply'),
	Replies          = req('/lib/constants/replies'),
	InvalidNickError = req('/lib/errors/invalid-nick'),
	ErrorReasons     = req('/lib/constants/error-reasons');


class NicknameInUseMessage extends ReplyMessage {

	getValuesForParameters() {
		return {
			nick: this.getNick()
		};
	}

	setValuesFromParameters(parameters) {
		this.setNick(parameters.get('nick'));
	}

	toError() {
		return new InvalidNickError(
			this.getNick(),
			ErrorReasons.ALREADY_IN_USE
		);
	}

}

extend(NicknameInUseMessage.prototype, {

	reply: Replies.ERR_NICKNAMEINUSE

});

module.exports = NicknameInUseMessage;
