
var
	has           = req('/lib/utilities/has'),
	Commands      = req('/lib/constants/commands'),
	ErrorReasons  = req('/lib/constants/error-reasons'),
	ReplyNumerics = req('/lib/constants/reply-numerics'),
	BaseError     = req('/lib/errors/base'),
	EventEmitter  = require('events').EventEmitter,
	createMessage = req('/lib/utilities/create-message');

var
	NotYetImplementedError            = req('/lib/errors/not-yet-implemented'),
	AbstractMethodNotImplementedError = req('/lib/errors/abstract-method-not-implemented'),
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

	parseCommandMessage(command, raw_message) {
		var message = createMessage(command);

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
		var message = createMessage(reply_numeric);

		return message.setRawMessage(raw_message).deserialize();
	}

	getConstructorForReplyNumeric(reply_numeric, raw_message) {
		// Special logic is needed in several cases, because of the unfortunate
		// overlapping of multiple message types for the same reply numeric:
		if (reply_numeric === ReplyNumerics.RPL_BOUNCE) {
			if (raw_message.indexOf(':Try') === -1) {
				reply_numeric = ReplyNumerics.ISUPPORT;
			}
		}

		return createMessage(reply_numeric);
	}

	getConstructorForCommand(command, raw_message) {

	}

	getConstructorForResponseType() {
		throw new AbstractMethodNotImplementedError(
			'getConstructorForResponseType()'
		);
	}

}

module.exports = new MessageParser();
