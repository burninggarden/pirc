var req = require('req');

var
	Commands                     = req('/constants/commands'),
	NumericRepliesToConstructors = req('/mappings/numeric-replies-to-constructors'),
	MessageParser                = req('/lib/message-parser');

var
	ServerJoinMessage    = req('/lib/server/messages/join'),
	ServerNoticeMessage  = req('/lib/server/messages/notice'),
	ServerPingMessage    = req('/lib/server/messages/ping'),
	ServerPrivateMessage = req('/lib/server/messages/private');


class ClientMessageParser extends MessageParser {

	getConstructorForCommand(command) {
		switch (command) {
			case Commands.JOIN:
				return ServerJoinMessage;

			case Commands.NOTICE:
				return ServerNoticeMessage;

			case Commands.PING:
				return ServerPingMessage;

			case Commands.PRIVMSG:
				return ServerPrivateMessage;

			default:
				return null;
		}
	}

	getConstructorForNumericReply(numeric_reply) {
		return NumericRepliesToConstructors[numeric_reply];
	}

}

module.exports = new ClientMessageParser();
