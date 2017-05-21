
var
	MessageParser = req('/lib/message-parser'),
	Commands      = req('/lib/constants/commands');

var
	ClientCapMessage     = req('/lib/client/messages/cap'),
	ClientJoinMessage    = req('/lib/client/messages/join'),
	ClientModeMessage    = req('/lib/client/messages/mode'),
	ClientNickMessage    = req('/lib/client/messages/nick'),
	ClientNoticeMessage  = req('/lib/client/messages/notice'),
	ClientPartMessage    = req('/lib/client/messages/part'),
	ClientPassMessage    = req('/lib/client/messages/pass'),
	ClientPingMessage    = req('/lib/client/messages/ping'),
	ClientPongMessage    = req('/lib/client/messages/pong'),
	ClientUserMessage    = req('/lib/client/messages/user'),
	ClientPrivateMessage = req('/lib/client/messages/private'),
	ClientQuitMessage    = req('/lib/client/messages/quit'),
	ClientTopicMessage   = req('/lib/client/messages/topic'),
	ClientWhoisMessage   = req('/lib/client/messages/whois');


class ServerMessageParser extends MessageParser {

	getConstructorForCommand(command) {
		switch (command) {
			case Commands.CAP:
				return ClientCapMessage;

			case Commands.JOIN:
				return ClientJoinMessage;

			case Commands.MODE:
				return ClientModeMessage;

			case Commands.NICK:
				return ClientNickMessage;

			case Commands.NOTICE:
				return ClientNoticeMessage;

			case Commands.PART:
				return ClientPartMessage;

			case Commands.PASS:
				return ClientPassMessage;

			case Commands.PING:
				return ClientPingMessage;

			case Commands.PONG:
				return ClientPongMessage;

			case Commands.PRIVMSG:
				return ClientPrivateMessage;

			case Commands.QUIT:
				return ClientQuitMessage;

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
