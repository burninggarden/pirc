
var req = require('req');

var
	has            = req('/utilities/has'),
	extend         = req('/utilities/extend'),
	isArray        = req('/utilities/is-array'),
	Commands       = req('/constants/commands'),
	ErrorReasons   = req('/constants/error-reasons'),
	ResponseTypes  = req('/constants/response-types'),
	StructureItems = req('/constants/structure-items'),
	NickValidator  = req('/validators/nick');

var
	InvalidCommandError             = req('/lib/errors/invalid-command'),
	InvalidStructureDefinitionError = req('/lib/errors/invalid-structure-definition'),
	InvalidMessageStructureError    = req('/lib/errors/invalid-message-structure'),
	InvalidResponseTypeError        = req('/lib/errors/invalid-response-type'),
	InvalidNickError                = req('/lib/errors/invalid-nick');


class Message {

	constructor() {
		this.validate();
	}

	validate() {
		this.validateCommand();
		this.validateStructureDefinition();
	}

	validateCommand() {
		if (!this.command) {
			throw new InvalidCommandError(this.command, ErrorReasons.OMITTED);
		}

		if (!has(Commands, this.command)) {
			throw new InvalidCommandError(this.command, ErrorReasons.WRONG_TYPE);
		}
	}

	validateResponseType() {
		if (!this.response_type) {
			throw new InvalidResponseTypeError(this.response_type, ErrorReasons.OMITTED);
		}

		if (!has(ResponseTypes, this.response_type)) {
			throw new InvalidResponseTypeError(this.response_type, ErrorReasons.WRONG_TYPE);
		}
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

	validateBody() {
		// noop for now; add validation later.
	}

	setRawMessage(raw_message) {
		this.raw_message = raw_message;
		return this;
	}

	setResponseType(response_type) {
		this.response_type = response_type;
		this.validateResponseType();
		return this;
	}

	setBody(body) {
		this.body = body;
		this.validateBody();
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

	getNick() {
		return this.nick;
	}

	validateNick(nick) {
		NickValidator.validate(nick);
	}

	getMessageParts() {
		if (this.raw_message === null) {
			throw new Error('no raw message set');
		}

		return this.raw_message.split(' ');
	}

	hasResponseType() {
		return this.response_type !== null;
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

			case StructureItems.COMMAND:
				return this.getCommand();

			case StructureItems.NICK:
				return this.getNick();

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

			case StructureItems.COMMAND:
				return this.processMessagePartAsCommand(message_part);

			case StructureItems.NICK:
				return this.processMessagePartAsNick(message_part);

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

	handleNickError(error) {
		if (!(error instanceof InvalidNickError)) {
			throw error;
		}

		switch (error.reason) {
			case ErrorReasons.OMITTED:
				return this.setResponse(ResponseTypes.NONICKNAMEGIVEN);

			case ErrorReasons.INVALID_CHARACTERS:
				return this.setResponse(ResponseTypes.ERRONEUSNICKNAME);

			default:
				throw error;
		}
	}

}

extend(Message.prototype, {
	raw_message:   null,

	response_type: null,

	command:       null,

	body:          null,

	/* @param {StructureItems[]} */
	structure_definition: null,

	nick:                 null
});

module.exports = Message;
