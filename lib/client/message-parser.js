var req = require('req');

var
	Commands                    = req('/constants/commands'),
	ResponseTypesToConstructors = req('/mappings/response-types-to-constructors'),
	MessageParser               = req('/lib/message-parser');

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

	getConstructorForResponseType(response_type) {
		return ResponseTypesToConstructors[response_type];
	}

}

module.exports = new ClientMessageParser();
