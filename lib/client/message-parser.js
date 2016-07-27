var req = require('req');

var
	Commands                     = req('/constants/commands'),
	NumericRepliesToConstructors = req('/mappings/numeric-replies-to-constructors'),
	MessageParser                = req('/lib/message-parser');

var
	ServerPingMessage   = req('/lib/server/messages/ping'),
	ServerNoticeMessage = req('/lib/server/messages/notice');


class ClientMessageParser extends MessageParser {

	getConstructorForCommand(command) {
		switch (command) {
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
