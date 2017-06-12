
var
	extend           = req('/lib/utilities/extend'),
	ServerMessage    = req('/lib/server/message'),
	ReplyNumerics    = req('/lib/constants/reply-numerics'),
	NickValidator    = req('/lib/validators/nick'),
	InvalidNickError = req('/lib/errors/invalid-nick'),
	ErrorReasons     = req('/lib/constants/error-reasons');


class NicknameInUseMessage extends ServerMessage {

	getNick() {
		return this.nick;
	}

	setNick(nick) {
		NickValidator.validate(nick);
		this.nick = nick;
	}

	applyParsedParameters(middle_parameters, trailing_parameter) {
		// The desired nick is returned as the last middle parameter:
		this.setNick(middle_parameters.pop());

		this.setBody(trailing_parameter);
	}

	serializeParameters() {
		var
			nick = this.getNick(),
			body = this.getBody();

		return `${nick} :${body}`;
	}

	toError() {
		return new InvalidNickError(
			this.getNick(),
			ErrorReasons.ALREADY_IN_USE
		);
	}

}

extend(NicknameInUseMessage.prototype, {

	reply_numeric: ReplyNumerics.ERR_NICKNAMEINUSE,
	nick:          null,
	body:          'Nickname is already in use.'

});

module.exports = NicknameInUseMessage;
