var req = require('req');

var
	extend        = req('/utilities/extend'),
	ClientMessage = req('/lib/client/message'),
	NickValidator = req('/validators/nick'),
	Commands      = req('/constants/commands');

class ClientNickMessage extends ClientMessage {

	setNick(nick) {
		this.validateNick(nick);
		this.nick = nick;
		return this;
	}

	validateNick(nick) {
		NickValidator.validate(nick);
	}

	serialize() {
		return this.command + ' ' + this.nick;
	}

}

extend(ClientNickMessage.prototype, {
	nick: null,
	command: Commands.NICK
});

module.exports = ClientNickMessage;
