var req = require('req');

var
	extend        = req('/utilities/extend'),
	ClientMessage = req('/lib/messages/client'),
	NickValidator = req('/validators/nick'),
	Commands      = req('/constants/commands');

class ClientNickMessage extends ClientMessage {

	constructor(nick) {
		super();

		this.nick = nick;

		this.validateNick();
	}

	validateNick() {
		NickValidator.validate(this.nick);
	}

	serialize() {
		return this.command + ' ' + this.nick;
	}

}

extend(ClientNickMessage.prototype, {
	command: Commands.NICK
});

module.exports = ClientNickMessage;
