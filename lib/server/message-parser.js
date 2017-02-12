var req = require('req');

var
	MessageParser = req('/lib/message-parser'),
	Commands      = req('/constants/commands');

var
	ClientCapMessage     = req('/lib/client/messages/cap'),
	ClientJoinMessage    = req('/lib/client/messages/join'),
	ClientNickMessage    = req('/lib/client/messages/nick'),
	ClientPartMessage    = req('/lib/client/messages/part'),
	ClientPingMessage    = req('/lib/client/messages/ping'),
	ClientPongMessage    = req('/lib/client/messages/pong'),
	ClientUserMessage    = req('/lib/client/messages/user'),
	ClientPrivateMessage = req('/lib/client/messages/private'),
	ClientTopicMessage   = req('/lib/client/messages/topic'),
	ClientWhoisMessage   = req('/lib/client/messages/whois');


class ServerMessageParser extends MessageParser {

	getConstructorForCommand(command) {
		switch (command) {
			case Commands.CAP:
				return void ClientCapMessage;

			case Commands.JOIN:
				return ClientJoinMessage;

			case Commands.NICK:
				return ClientNickMessage;

			case Commands.PART:
				return ClientPartMessage;

			case Commands.PING:
				return ClientPingMessage;

			case Commands.PONG:
				return ClientPongMessage;

			case Commands.PRIVMSG:
				return ClientPrivateMessage;

			case Commands.TOPIC:
				return ClientTopicMessage;

			case Commands.USER:
				return ClientUserMessage;

			case Commands.WHOIS:
				return ClientWhoisMessage;
		}
	}

}

module.exports = new ServerMessageParser();
