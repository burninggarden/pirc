
var req = require('req');

var
	has           = req('/utilities/has'),
	extend        = req('/utilities/extend'),
	Commands      = req('/constants/commands'),
	ErrorReasons  = req('/constants/error-reasons'),
	ResponseTypes = req('/constants/response-types');

var
	InvalidCommandError               = req('/lib/errors/invalid-command'),
	AbstractMethodNotImplementedError = req('/lib/errors/abstract-method-not-implemented'),
	InvalidResponseTypeError          = req('/lib/errors/invalid-response-type');


class Message {

	constructor() {
		this.validate();
	}

	validate() {
		this.validateCommand();
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

	getParts() {
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
		throw new AbstractMethodNotImplementedError('deserialize()');
	}

}

extend(Message.prototype, {
	raw_message: null,

	response_type: null,

	command: null,

	body: null
});

module.exports = Message;
