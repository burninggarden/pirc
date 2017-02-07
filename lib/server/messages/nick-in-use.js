var req = require('req');

var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ReplyNumerics = req('/constants/reply-numerics'),
	NickValidator = req('/validators/nick');

class NicknameInUseMessage extends ServerMessage {

	getNick() {
		return this.nick;
	}

	setNick(nick) {
		NickValidator.validate(nick);
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

}

extend(NicknameInUseMessage.prototype, {

	reply_numeric: ReplyNumerics.ERR_NICKNAMEINUSE,
	nick:          null,
	body:          'Nickname is already in use.'

});

module.exports = NicknameInUseMessage;
