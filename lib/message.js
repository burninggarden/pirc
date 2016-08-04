
var req = require('req');

var
	has           = req('/utilities/has'),
	extend        = req('/utilities/extend'),
	Commands      = req('/constants/commands'),
	ErrorReasons  = req('/constants/error-reasons'),
	ResponseTypes = req('/constants/response-types'),
	MessageParts  = req('/constants/message-parts');

var
	InvalidCommandError               = req('/lib/errors/invalid-command'),
	InvalidStructureError             = req('/lib/errors/invalid-structure'),
	InvalidMessagePartError           = req('/lib/errors/invalid-message-part'),
	AbstractMethodNotImplementedError = req('/lib/errors/abstract-method-not-implemented'),
	InvalidResponseTypeError          = req('/lib/errors/invalid-response-type');


class Message {

	constructor() {
		this.validate();
	}

	validate() {
		this.validateCommand();
		this.validateDeserialization();
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

	validateStructure() {
		// If the child class has defined its own serialization and
		// deserialization methods, we don't require an explicit structure
		// array to be defined. We can just bail out, if that's the case.
		if (
			   this.serialize   !== Message.prototype.serialize
			&& this.deserialize !== Message.prototype.deserialize
		) {
			return;
		}

		if (!this.structure) {
			throw new InvalidStructureError(this.structure, ErrorReasons.OMITTED);
		}

		if (!isArray(this.structure)) {
			throw new InvalidStructureError(this.structure, ErrorReasons.WRONG_TYPE);
		}

		var index = 0;

		while (index < this.structure.length) {
			let structure_item = this.structure[index];

			if (!has(StructureItems, structure_item)) {
				throw new InvalidStructureError(this.structure, ErrorReasons.UNKNOWN_TYPE);
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
		throw new AbstractMethodNotImplementedError('serialize()');
	}

	deserialize() {
		var message_parts = this.getMessageParts();

		if (parts[0] !== Commands.NICK) {
			throw new InvalidMessageStructureError(this.raw_message);
		}

		try {
			this.setNick(parts[1]);
		} catch (error) {
			if (error instanceof InvalidNickError) {
				switch (error.reason) {
					case ErrorReasons.OMITTED:
						return this.setResponse(ResponseTypes.NONICKNAMEGIVEN);

					case ErrorReasons.INVALID_CHARACTERS:
						return this.setResponse(ResponseTypes.ERRONEUSNICKNAME);

					default:
						throw error;
				}
			} else {
				throw error;
			}
		}

		return this;
	}

}

extend(Message.prototype, {
	raw_message:   null,

	response_type: null,

	command:       null,

	body:          null,

	// @param array
	structure:     null
});

module.exports = Message;
