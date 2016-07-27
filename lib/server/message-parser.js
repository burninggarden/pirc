var req = require('req');

var
	MessageParser = req('/lib/message-parser'),
	Commands      = req('/constants/commands');

var
	ClientJoinMessage = req('/lib/client/messages/join'),
	ClientNickMessage = req('/lib/client/messages/nick'),
	ClientPartMessage = req('/lib/client/messages/part'),
	ClientUserMessage = req('/lib/client/messages/user');


class ServerMessageParser extends MessageParser {

	getConstructorForCommand(command) {
		switch (command) {
			case Commands.JOIN:
				return ClientJoinMessage;

			case Commands.NICK:
				return ClientNickMessage;

			case Commands.PART:
				return ClientPartMessage;

			case Commands.USER:
				return ClientUserMessage;
		}
	}

}

module.exports = new ServerMessageParser();