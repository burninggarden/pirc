var req = require('req');

var
	has                         = req('/utilities/has'),
	ErrorReasons                = req('/constants/error-reasons'),
	Commands                    = req('/constants/commands'),
	ResponseTypes               = req('/constants/response-types'),
	ResponseCodes               = req('/constants/response-codes'),
	ResponseTypesToConstructors = req('/mappings/response-types-to-constructors');

var
	NotYetImplementedError   = req('/lib/errors/not-yet-implemented'),
	InvalidResponseTypeError = req('/lib/errors/invalid-response-type');

var
	ServerPingMessage   = req('/lib/messages/server/ping'),
	ServerNoticeMessage = req('/lib/messages/server/notice');


class MessageParser {

	getResponseTypeFromCode(response_code) {
		if (ResponseCodes[response_code] !== undefined) {
			return ResponseCodes[response_code];
		} else {
			throw new NotYetImplementedError('Handling for response code ' + response_code);
		}
	}

	parse(server_message) {
		if (!server_message) {
			return;
		}

		var
			parts = server_message.split(' '),
			leader;

		if (parts[0][0] === ':') {
			leader = parts[1];
		} else {
			leader = parts[0];
		}

		if (has(Commands, leader)) {
			return this.parseServerCommandMessage(leader, server_message);
		} else  {
			return this.parseServerResponseMessage(leader, server_message);
		}
	}

	parseServerCommandMessage(command, server_message) {
		var constructor;

		switch (command) {
			case Commands.PING:
				constructor = ServerPingMessage;
				break;

			case Commands.NOTICE:
				constructor = ServerNoticeMessage;
				break;

			default:
				throw new NotYetImplementedError('Message handling for command: ' + command);
		}

		var message = new constructor();

		message.parseString(server_message);

		return message;
	}

	parseServerResponseMessage(response_type, server_message) {
		if (!isNaN(+response_type)) {
			response_type = this.getResponseTypeFromCode(response_type);
		}

		if (!response_type) {
			throw new InvalidResponseTypeError(response_type, ErrorReasons.OMITTED);
		}

		if (!has(ResponseTypes, response_type)) {
			throw new InvalidResponseTypeError(response_type, ErrorReasons.WRONG_TYPE);
		}

		var constructor = ResponseTypesToConstructors[response_type];

		if (!constructor) {
			throw new NotYetImplementedError('Message handling for response type: ' + response_type);
		}

		var message = new constructor();

		message.parseString(server_message);

		return message;
	}

}

module.exports = new MessageParser();
