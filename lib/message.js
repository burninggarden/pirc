
var req = require('req');

var
	has            = req('/utilities/has'),
	extend         = req('/utilities/extend'),
	isArray        = req('/utilities/is-array'),
	ErrorReasons   = req('/constants/error-reasons'),
	NumericReplies = req('/constants/numeric-replies'),
	StructureItems = req('/constants/structure-items');

var
	NickValidator         = req('/validators/nick'),
	ChannelNameValidator  = req('/validators/channel-name'),
	CommandValidator      = req('/validators/command'),
	NumericReplyValidator = req('/validators/numeric-reply'),
	BodyValidator         = req('/validators/body');

var
	InvalidStructureDefinitionError = req('/lib/errors/invalid-structure-definition'),
	InvalidMessageStructureError    = req('/lib/errors/invalid-message-structure'),
	InvalidNickError                = req('/lib/errors/invalid-nick'),
	InvalidNumericReplyError        = req('/lib/errors/invalid-numeric-reply'),
	InvalidCommandError             = req('/lib/errors/invalid-command');


class Message {

	constructor() {
		this.validate();
	}

	validate() {
		if (this.hasNumericReply()) {
			this.validateNumericReply(this.numeric_reply);
		} else {
			this.validateCommand(this.command);
		}

		this.validateStructureDefinition(this.structure_definition);
	}

	validateCommand(command) {
		CommandValidator.validate(command);
	}

	validateNumericReply(numeric_reply) {
		NumericReplyValidator.validate(numeric_reply);
	}

	validateStructureDefinition() {
		// If the child class has defined its own serialization and
		// deserialization methods, we don't require an explicit structure
		// array to be defined. We can just bail out, if that's the case.
		if (
			   this.serialize   !== Message.prototype.serialize
			&& this.deserialize !== Message.prototype.deserialize
		) {
			return;
		}

		if (!this.structure_definition) {
			throw new InvalidStructureDefinitionError(
				this.structure_definition,
				ErrorReasons.OMITTED
			);
		}

		if (!isArray(this.structure_definition)) {
			throw new InvalidStructureDefinitionError(
				this.structure_definition,
				ErrorReasons.WRONG_TYPE
			);
		}

		var index = 0;

		while (index < this.structure_definition.length) {
			let structure_item = this.structure_definition[index];

			if (!has(StructureItems, structure_item)) {
				throw new InvalidStructureDefinitionError(
					this.structure_definition,
					ErrorReasons.UNKNOWN_TYPE
				);
			}

			index++;
		}
	}

	validateBody(body) {
		BodyValidator.validate(body);
	}

	setRawMessage(raw_message) {
		this.raw_message = raw_message;
		return this;
	}

	setNumericReplyResponse(numeric_reply_response) {
		this.validateNumericReply(numeric_reply_response);
		this.numeric_reply_response = numeric_reply_response;
		return this;
	}

	setBody(body) {
		this.validateBody(body);
		this.body = body;
		return this;
	}

	getBody() {
		return this.body;
	}

	getCommand() {
		return this.command;
	}

	setNick(nick) {
		this.validateNick(nick);
		this.nick = nick;
		return this;
	}

	setChannelName(channel_name) {
		this.validateChannelName(channel_name);
		this.channel_name = channel_name;
		return this;
	}


	getNick() {
		return this.nick;
	}

	validateNick(nick) {
		NickValidator.validate(nick);
	}

	validateChannelName(channel_name) {
		ChannelNameValidator.validate(channel_name);
	}

	getMessageParts() {
		if (this.raw_message === null) {
			throw new Error('no raw message set');
		}

		return this.raw_message.split(' ');
	}

	hasNumericReply() {
		return this.numeric_reply !== null;
	}

	getNumericReply() {
		return this.numeric_reply;
	}

	getChannelName() {
		return this.channel_name;
	}

	setChannelName(channel_name) {
		this.channel_name = channel_name;
		return this;
	}

	serialize() {
		var
			index         = 0,
			message_parts = [ ];

		while (index < this.structure_definition.length) {
			let
				structure_item = this.structure_definition[index],
				message_part   = this.getMessagePartForStructureItem(structure_item);

			message_parts.push(message_part);
			index++;
		}

		return message_parts.join(' ');
	}

	getMessagePartForStructureItem(structure_item) {
		switch (structure_item) {
			case StructureItems.BODY:
				return ':' + this.getBody();

			case StructureItems.CHANNEL_NAME:
				return this.getChannelName();

			case StructureItems.COMMAND:
				return this.getCommand();

			case StructureItems.NAMES_DELIMITER:
				return '=';

			case StructureItems.NICK:
				return this.getNick();

			case StructureItems.NUMERIC_REPLY:
				return this.getNumericReply();


			default:
				throw new InvalidStructureDefinitionError(
					this.structure_definition,
					ErrorReasons.WRONG_TYPE
				);
		}
	}

	deserialize() {
		var message_parts = this.getMessageParts();

		if (message_parts.length !== this.structure_definition.length) {
			throw new InvalidMessageStructureError(this.raw_message);
		}

		var index = 0;

		while (index < this.structure_definition.length) {
			let
				message_part   = message_parts[index],
				structure_item = this.structure_definition[index];

			this.processMessagePartAsStructureItem(message_part, structure_item);

			index++;
		}

		return this;
	}

	processMessagePartAsStructureItem(message_part, structure_item) {
		switch (structure_item) {
			case StructureItems.BODY:
				return this.processMessagePartAsBody(message_part);

			case StructureItems.CHANNEL_NAME:
				return this.processMessagePartAsChannelName(message_part);

			case StructureItems.COMMAND:
				return this.processMessagePartAsCommand(message_part);

			case StructureItems.NICK:
				return this.processMessagePartAsNick(message_part);

			case StructureItems.NUMERIC_REPLY:
				return this.processMessagePartAsNumericReply(message_part);

			default:
				throw new InvalidStructureDefinitionError(
					this.structure_definition,
					ErrorReasons.UNKNOWN_TYPE
				);
		}
	}

	processMessagePartAsBody(message_part) {
		// We need to trim off the leading colon:
		var body = message_part.slice(1);

		this.setBody(body);
	}

	processMessagePartAsChannelName(message_part) {
		try {
			this.setChannelName(message_part);
		} catch (error) {
			this.handleChannelNameError(error);
		}
	}

	processMessagePartAsCommand(message_part) {
		if (message_part !== this.command) {
			throw new InvalidCommandError(this.command, ErrorReasons.WRONG_TYPE);
		}
	}

	processMessagePartAsNick(message_part) {
		try {
			this.setNick(message_part);
		} catch (error) {
			this.handleNickError(error);
		}
	}

	processMessagePartAsNumericReply(message_part) {
		if (message_part !== this.numeric_reply) {
			throw new InvalidNumericReplyError(message_part, ErrorReasons.WRONG_TYPE);
		}
	}

	handleNickError(error) {
		if (!(error instanceof InvalidNickError)) {
			throw error;
		}

		switch (error.reason) {
			case ErrorReasons.OMITTED:
				return this.setNumericReplyResponse(NumericReplies.ERR_NONICKNAMEGIVEN);

			case ErrorReasons.INVALID_CHARACTERS:
				return this.setNumericReplyResponse(NumericReplies.ERR_ERRONEUSNICKNAME);

			default:
				throw error;
		}
	}

}

extend(Message.prototype, {
	raw_message:            null,

	numeric_reply:          null,
	numeric_reply_response: null,

	command:                null,

	body:                   null,

	channel_name:           null,

	structure_definition:   null,

	nick:                   null
});

module.exports = Message;
