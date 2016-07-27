var req = require('req');

var
	has            = req('/utilities/has'),
	Commands       = req('/constants/commands'),
	ErrorReasons   = req('/constants/error-reasons'),
	NumericReplies = req('/constants/numeric-replies');

var
	NotYetImplementedError            = req('/lib/errors/not-yet-implemented'),
	AbstractMethodNotImplementedError = req('/lib/errors/abstract-method-not-implemented'),
	InvalidNumericReplyError          = req('/lib/errors/invalid-numeric-reply');

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
			return this.parseNumericReplyMessage(leader, raw_message);
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

	parseNumericReplyMessage(numeric_reply, server_message) {
		if (!numeric_reply) {
			throw new InvalidNumericReplyError(numeric_reply, ErrorReasons.OMITTED);
		}

		if (!has(NumericReplies, numeric_reply)) {
			throw new InvalidNumericReplyError(numeric_reply, ErrorReasons.WRONG_TYPE);
		}

		var constructor = this.getConstructorForNumericReply(numeric_reply);

		if (!constructor) {
			throw new NotYetImplementedError('Message handling for numeric_reply: ' + numeric_reply);
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
