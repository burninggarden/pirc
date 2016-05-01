var req = require('req');

var
	MessageParser = req('/lib/message-parser'),
	Commands      = req('/constants/commands');

var
	ClientNickMessage = req('/lib/client/messages/nick'),
	ClientUserMessage = req('/lib/client/messages/user');


class ServerMessageParser extends MessageParser {

	getConstructorForCommand(command) {
		switch (command) {
			case Commands.NICK:
				return ClientNickMessage;

			case Commands.USER:
				return ClientUserMessage;
		}
	}

}

module.exports = new ServerMessageParser();
