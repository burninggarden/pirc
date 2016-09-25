var req = require('req');

var
	has           = req('/utilities/has'),
	Commands      = req('/constants/commands'),
	ErrorReasons  = req('/constants/error-reasons'),
	ReplyNumerics = req('/constants/reply-numerics');

var
	NotYetImplementedError            = req('/lib/errors/not-yet-implemented'),
	AbstractMethodNotImplementedError = req('/lib/errors/abstract-method-not-implemented'),
	InvalidReplyNumericError          = req('/lib/errors/invalid-numeric-reply');

class MessageParser {

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
			return this.parseReplyNumericMessage(leader, raw_message);
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

	parseReplyNumericMessage(numeric_replies, server_message) {
		if (!numeric_replies) {
			throw new InvalidReplyNumericError(numeric_replies, ErrorReasons.OMITTED);
		}

		if (!has(ReplyNumerics, numeric_replies)) {
			throw new InvalidReplyNumericError(numeric_replies, ErrorReasons.WRONG_TYPE);
		}

		var constructor = this.getConstructorForReplyNumeric(numeric_replies);

		if (!constructor) {
			throw new NotYetImplementedError('Message handling for numeric_replies: ' + numeric_replies);
		}

		var message = new constructor();

		return message.setRawMessage(server_message).deserialize();
	}

	getConstructorForCommand() {
		throw new AbstractMethodNotImplementedError('getConstructorForCommand()');
	}

	getConstructorForResponseType() {
		throw new AbstractMethodNotImplementedError('getConstructorForResponseType()');
	}

}

module.exports = MessageParser;
