
var
	has           = req('/lib/utilities/has'),
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

		var match = this.getABNFParser().parse(raw_message);

		if (!match) {
			throw new NotYetImplementedError(
				'Handling for unparseable messages'
			);
		}

		var command = match.get('command');

		if (has(Commands, command)) {
			return this.parseCommandMessage(command, match);
		} else if (has(ReplyNumerics, command)) {
			return this.parseReplyNumericMessage(command, match);
		}

		throw new InvalidCommandError(
			command,
			ErrorReasons.UNSUPPORTED
		);
	}

	createMessageForCommand(command) {
		var constructor = this.getConstructorForCommand(command);

		if (!constructor) {
			throw new NotYetImplementedError(
				'Message handling for command: ' + command
			);
		}

		return new constructor();
	}

	parseCommandMessage(command, raw_message) {
		var message = this.createMessageForCommand(command);

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
