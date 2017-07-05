
var
	has           = req('/lib/utilities/has'),
	Commands      = req('/lib/constants/commands'),
	ReplyNumerics = req('/lib/constants/reply-numerics'),
	EventEmitter  = require('events').EventEmitter,
	createMessage = req('/lib/utilities/create-message');


class MessageParser extends EventEmitter {

	parse(raw_message) {
		if (raw_message.length === 0) {
			return null;
		}

		var match = this.getABNFParser().parse(raw_message);

		if (!match) {
			throw new Error(
				'Not implemented: handling for unparseable messages'
			);
		}

		var command = match.get('command');

		if (has(Commands, command)) {
			return this.parseCommandMessage(command, match);
		} else if (has(ReplyNumerics, command)) {
			return this.parseReplyMessage(command, match);
		}

		throw new Error('Invalid command: ' + command);
	}

	parseCommandMessage(command, raw_message) {
		var message = createMessage(command);

		return message.setRawMessage(raw_message).deserialize();
	}

	parseReplyMessage(reply_numeric, raw_message) {
		var
			reply   = this.getReplyForReplyNumeric(reply_numeric),
			message = createMessage(reply);

		return message.setRawMessage(raw_message).deserialize();
	}

	getReplyForReplyNumeric(reply_numeric) {
		var key;

		for (key in ReplyNumerics) {
			if (ReplyNumerics[key] === reply_numeric) {
				return key;
			}
		}

		return null;
	}

}

module.exports = new MessageParser();
