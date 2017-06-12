
var
	has           = req('/lib/utilities/has'),
	Commands      = req('/lib/constants/commands'),
	ErrorReasons  = req('/lib/constants/error-reasons'),
	ReplyNumerics = req('/lib/constants/reply-numerics'),
	BaseError     = req('/lib/errors/base'),
	EventEmitter  = require('events').EventEmitter,
	createReply   = req('/lib/utilities/create-reply');

var
	NotYetImplementedError            = req('/lib/errors/not-yet-implemented'),
	AbstractMethodNotImplementedError = req('/lib/errors/abstract-method-not-implemented'),
	InvalidReplyNumericError          = req('/lib/errors/invalid-reply-numeric'),
	InvalidCommandError               = req('/lib/errors/invalid-command');

var
	CapMessage      = req('/lib/messages/commands/cap'),
	ISupportMessage = req('/lib/messages/commands/i-support'),
	JoinMessage     = req('/lib/messages/commands/join'),
	ModeMessage     = req('/lib/messages/commands/mode'),
	NickMessage     = req('/lib/messages/commands/nick'),
	NoticeMessage   = req('/lib/messages/commands/notice'),
	PingMessage     = req('/lib/messages/commands/ping'),
	PongMessage     = req('/lib/messages/commands/pong'),
	PartMessage     = req('/lib/messages/commands/part'),
	PassMessage     = req('/lib/messages/commands/pass'),
	PrivateMessage  = req('/lib/messages/commands/private'),
	QuitMessage     = req('/lib/messages/commands/quit'),
	TopicMessage    = req('/lib/messages/commands/topic'),
	UserMessage     = req('/lib/messages/commands/user'),
	WhoMessage      = req('/lib/messages/commands/who'),
	WhoisMessage    = req('/lib/messages/commands/whois'),
	WhowasMessage   = req('/lib/messages/commands/whowas');


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

	getConstructorForCommand(command) {
		switch (command) {
			case Commands.CAP:
				return CapMessage;

			case Commands.JOIN:
				return JoinMessage;

			case Commands.MODE:
				return ModeMessage;

			case Commands.NICK:
				return NickMessage;

			case Commands.NOTICE:
				return NoticeMessage;

			case Commands.PART:
				return PartMessage;

			case Commands.PASS:
				return PassMessage;

			case Commands.PING:
				return PingMessage;

			case Commands.PONG:
				return PongMessage;

			case Commands.PRIVMSG:
				return PrivateMessage;

			case Commands.QUIT:
				return QuitMessage;

			case Commands.TOPIC:
				return TopicMessage;

			case Commands.USER:
				return UserMessage;

			case Commands.WHO:
				return WhoMessage;

			case Commands.WHOIS:
				return WhoisMessage;

			case Commands.WHOWAS:
				return WhowasMessage;

			default:
				return null;
		}
	}

	getConstructorForReplyNumeric(reply_numeric, raw_message) {
		// Special logic is needed in several cases, because of the unfortunate
		// overlapping of multiple message types for the same reply numeric:
		if (reply_numeric === ReplyNumerics.RPL_BOUNCE) {
			if (raw_message.indexOf(':Try') === -1) {
				return ISupportMessage;
			}
		}

		return createReply(reply_numeric);
	}

	getConstructorForResponseType() {
		throw new AbstractMethodNotImplementedError(
			'getConstructorForResponseType()'
		);
	}

}

module.exports = new MessageParser();
