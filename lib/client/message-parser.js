var req = require('req');

var
	Commands                     = req('/constants/commands'),
	NumericRepliesToConstructors = req('/mappings/numeric-replies-to-constructors'),
	MessageParser                = req('/lib/message-parser');

var
	ServerJoinMessage   = req('/lib/server/messages/join'),
	ServerPingMessage   = req('/lib/server/messages/ping'),
	ServerNoticeMessage = req('/lib/server/messages/notice');


class ClientMessageParser extends MessageParser {

	getConstructorForCommand(command) {
		switch (command) {
			case Commands.JOIN:
				return ServerJoinMessage;

			case Commands.PING:
				return ServerPingMessage;

			case Commands.NOTICE:
				return ServerNoticeMessage;

			default:
				return null;
		}
	}

	getConstructorForNumericReply(numeric_reply) {
		return NumericRepliesToConstructors[numeric_reply];
	}

}

module.exports = new ClientMessageParser();
