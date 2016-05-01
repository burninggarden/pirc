var req = require('req');

var
	extend        = req('/utilities/extend'),
	ClientMessage = req('/lib/client/message'),
	NickValidator = req('/validators/nick'),
	Commands      = req('/constants/commands'),
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

	deserialize() {
		var parts = this.getParts();

		if (parts[0] !== Commands.NICK) {
			throw new InvalidMessageStructureError(this.raw_message);
		}

		try {
			this.setNick(parts[1]);
		} catch (error) {
			if (error instanceof InvalidNickError) {
				switch (error.reason) {
					case ErrorReasons.OMITTED:
						return this.setResponse(ResponseTypes.NONICKNAMEGIVEN);

					case ErrorReasons.INVALID_CHARACTERS:
						return this.setResponse(ResponseTypes.ERRONEUSNICKNAME);

					default:
						throw error;
				}
			} else {
				throw error;
			}
		}

		return this;
	}

}

extend(ClientNickMessage.prototype, {
	nick: null,
	command: Commands.NICK
});

module.exports = ClientNickMessage;
