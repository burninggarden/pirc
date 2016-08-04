var req = require('req');

var
	extend        = req('/utilities/extend'),
	ClientMessage = req('/lib/client/message'),
	NickValidator = req('/validators/nick'),
	Commands      = req('/constants/commands'),
	MessageParts  = req('/constants/message-parts'),
	ErrorReasons  = req('/constants/error-reasons'),
	ResponseTypes = req('/constants/response-types');

var
	InvalidMessageStructureError = req('/lib/errors/invalid-message-structure'),
	InvalidNickError             = req('/lib/errors/invalid-nick');

class ClientNickMessage extends ClientMessage {

	setNick(nick) {
		this.validateNick(nick);
		this.nick = nick;
		return this;
	}

	getNick() {
		return this.nick;
	}

	validateNick(nick) {
		NickValidator.validate(nick);
	}

	serialize() {
		return this.command + ' ' + this.nick;
	}

}

extend(ClientNickMessage.prototype, {
	structure: [MessageParts.COMMAND, MessageParts.NICK],
	nick:      null,
	command:   Commands.NICK
});

module.exports = ClientNickMessage;
