
var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ReplyNumerics = req('/constants/reply-numerics'),
	NickValidator = req('/validators/nick');


class ServerNoSuchNickMessage extends ServerMessage {

	setNick(nick) {
		NickValidator.validate(nick);
		this.nick = nick;
	}

	getNick(nick) {
		return this.nick;
	}

	serializeParams() {
		var
			targets = this.serializeTargets(),
			nick    = this.getNick(),
			body    = this.getBody();

		return `${targets} ${nick} :${body}`;
	}

	applyParsedParams(middle_params, trailing_param) {
		this.setNick(middle_params.pop());
		this.setTargetStrings(middle_params);
		this.setBody(trailing_param);
	}

}

extend(ServerNoSuchNickMessage.prototype, {
	reply_numeric: ReplyNumerics.ERR_NOSUCHNICK,
	body:          'No such nick/channel',
	nick:          null
});

module.exports = ServerNoSuchNickMessage;
