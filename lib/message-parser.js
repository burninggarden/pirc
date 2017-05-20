
var
	has           = req('/utilities/has'),
	Commands      = req('/lib/constants/commands'),
	ErrorReasons  = req('/lib/constants/error-reasons'),
	ReplyNumerics = req('/lib/constants/reply-numerics'),
	BaseError     = req('/lib/errors/base'),
	EventEmitter  = require('events').EventEmitter;

var
	NotYetImplementedError            = req('/lib/errors/not-yet-implemented'),
	AbstractMethodNotImplementedError = req('/lib/errors/abstract-method-not-implemented'),
	InvalidReplyNumericError          = req('/lib/errors/invalid-reply-numeric'),
	InvalidCommandError               = req('/lib/errors/invalid-command');

class MessageParser extends EventEmitter {

	parse(raw_message) {
		if (raw_message.length === 0) {
			return null;
		}

		var leader = this.getLeaderForMessage(raw_message);

		if (has(Commands, leader)) {
			return this.parseCommandMessage(leader, raw_message);
		} else if (has(ReplyNumerics, leader)) {
			return this.parseReplyNumericMessage(leader, raw_message);
		}

		throw new InvalidCommandError(
			leader,
			ErrorReasons.UNSUPPORTED
		);
	}

	getLeaderForMessage(raw_message) {
		var parts = raw_message.split(' ');

		if (parts[0][0] === ':') {
			return parts[1];
		} else {
			return parts[0];
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

		try {
			return message.setRawMessage(raw_message).deserialize();
		} catch (error) {
			if (error instanceof BaseError) {
				error.setCommand(command);
			}

			throw error;
		}
	}

	parseReplyNumericMessage(reply_numeric, raw_message) {
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

		var constructor = this.getConstructorForReplyNumeric(
			reply_numeric,
			raw_message
		);

		if (!constructor) {
			throw new NotYetImplementedError(
				'Message handling for reply numeric: ' + reply_numeric
			);
		}

		var message = new constructor();

		return message.setRawMessage(raw_message).deserialize();
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
