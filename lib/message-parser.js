var req = require('req');

var
	has           = req('/utilities/has'),
	ResponseCodes = req('/constants/response-codes'),
	Commands      = req('/constants/commands'),
	ErrorReasons  = req('/constants/error-reasons'),
	ResponseTypes = req('/constants/response-types'),
	ResponseCodes = req('/constants/response-codes');

var
	NotYetImplementedError            = req('/lib/errors/not-yet-implemented'),
	AbstractMethodNotImplementedError = req('/lib/errors/abstract-method-not-implemented'),
	InvalidResponseTypeError          = req('/lib/errors/invalid-response-type');

class MessageParser {

	getResponseTypeFromCode(response_code) {
		if (ResponseCodes[response_code] !== undefined) {
			return ResponseCodes[response_code];
		} else {
			throw new NotYetImplementedError('Handling for response code ' + response_code);
		}
	}

	parse(raw_message) {
		if (raw_message.length === 0) {
			return null;
		}

		var
			parts = raw_message.split(' '),
			leader;

		if (parts[0][0] === ':') {
			leader = parts[1];
		} else {
			leader = parts[0];
		}

		if (has(Commands, leader)) {
			return this.parseCommandMessage(leader, raw_message);
		} else  {
			return this.parseResponseMessage(leader, raw_message);
		}
	}

	parseCommandMessage(command, raw_message) {
		var constructor = this.getConstructorForCommand(command);

		if (!constructor) {
			throw new NotYetImplementedError('Message handling for command: ' + command);
		}

		var message = new constructor();

		return message.setRawMessage(raw_message).deserialize();
	}

	parseResponseMessage(response_type, server_message) {
		if (!isNaN(+response_type)) {
			response_type = this.getResponseTypeFromCode(response_type);
		}

		if (!response_type) {
			throw new InvalidResponseTypeError(response_type, ErrorReasons.OMITTED);
		}

		if (!has(ResponseTypes, response_type)) {
			throw new InvalidResponseTypeError(response_type, ErrorReasons.WRONG_TYPE);
		}

		var constructor = this.getConstructorForResponseType(response_type);

		if (!constructor) {
			throw new NotYetImplementedError('Message handling for response type: ' + response_type);
		}

		var message = new constructor();

		message.parseString(server_message);

		return message;
	}

	getConstructorForCommand() {
		throw new AbstractMethodNotImplementedError('getConstructorForCommand()');
	}

	getConstructorForResponseType() {
		throw new AbstractMethodNotImplementedError('getConstructorForResponseType()');
	}

}

module.exports = MessageParser;
