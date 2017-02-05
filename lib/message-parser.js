var req = require('req');

var
	has           = req('/utilities/has'),
	Commands      = req('/constants/commands'),
	ErrorReasons  = req('/constants/error-reasons'),
	ReplyNumerics = req('/constants/reply-numerics'),
	EventEmitter  = require('events').EventEmitter;

var
	NotYetImplementedError            = req('/lib/errors/not-yet-implemented'),
	AbstractMethodNotImplementedError = req('/lib/errors/abstract-method-not-implemented'),
	InvalidReplyNumericError          = req('/lib/errors/invalid-reply-numeric');

class MessageParser extends EventEmitter {

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
		} else if (has(ReplyNumerics, leader)) {
			return this.parseReplyNumericMessage(leader, raw_message);
		} else {
			throw new Error(`Invalid message: "${raw_message}"`);
		}
	}

	parseCommandMessage(command, raw_message) {
		var constructor = this.getConstructorForCommand(command);

		if (!constructor) {
			throw new NotYetImplementedError(
				'Message handling for command: ' + command
			);
		}

		var message = new constructor();

		return message.setRawMessage(raw_message).deserialize();
	}

	parseReplyNumericMessage(reply_numeric, server_message) {
		if (!reply_numeric) {
			throw new InvalidReplyNumericError(
				reply_numeric,
				ErrorReasons.OMITTED
			);
		}

		if (!has(ReplyNumerics, reply_numeric)) {
			throw new InvalidReplyNumericError(
				reply_numeric,
				ErrorReasons.WRONG_TYPE
			);
		}

		var constructor = this.getConstructorForReplyNumeric(reply_numeric);

		if (!constructor) {
			throw new NotYetImplementedError(
				'Message handling for reply numeric: ' + reply_numeric
			);
		}

		var message = new constructor();

		return message.setRawMessage(server_message).deserialize();
	}

	getConstructorForCommand() {
		throw new AbstractMethodNotImplementedError(
			'getConstructorForCommand()'
		);
	}

	getConstructorForReplyNumeric() {
		throw new AbstractMethodNotImplementedError(
			'getConstructorForReplyNumeric()'
		);
	}

	getConstructorForResponseType() {
		throw new AbstractMethodNotImplementedError(
			'getConstructorForResponseType()'
		);
	}

}

module.exports = MessageParser;
