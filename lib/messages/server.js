var req = require('req');

var
	has              = req('/utilities/has'),
	extend           = req('/utilities/extend'),
	Message          = req('/lib/message'),
	ResponseTypes    = req('/constants/response-types'),
	ResponseCodes    = req('/constants/response-codes'),
	ErrorReasons     = req('/constants/error-reasons'),
	CharacterClasses = req('/constants/character-classes');

var
	InvalidResponseTypeError          = req('/lib/errors/invalid-response-type'),
	AbstractMethodNotImplementedError = req('/lib/errors/abstract-method-not-implemented');


class ServerMessage extends Message {

	validate() {
		if (this.command) {
			this.validateCommand();
		} else {
			this.validateResponseType();
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

	partIsPrefixed(part) {
		return part[0] === CharacterClasses.MESSAGE_PREFIX;
	}

	partIsCommand(part) {
		return this.command && part === this.command;
	}

	partIsResponseCode(part) {
		return ResponseCodes[part] !== undefined;
	}

	parseString(string) {
		this.raw_message = string;

		var
			parts        = string.split(' '),
			primary_part = parts[0];

		if (this.partIsPrefixed(primary_part)) {
			parts.shift();
			this.prefix = primary_part;
			primary_part = parts[0];
		}

		if (this.partIsCommand(primary_part)) {
			parts.shift();
			primary_part = parts[0];
		}

		if (this.partIsResponseCode(primary_part)) {
			parts.shift();
			primary_part = parts[0];
		}

		var cleaned_parts = [ ];

		while (parts.length) {
			let part = parts[0];

			if (this.partIsPrefixed(part)) {
				break;
			}

			cleaned_parts.push(parts.shift());
		}

		this.message = parts.join(' ');

		if (cleaned_parts.length) {
			this.setMessageParts(cleaned_parts);
		}
	}

	setMessageParts(message_parts) {
		throw new AbstractMethodNotImplementedError('setMessageParts()');
	}

}

extend(ServerMessage.prototype, {

	response_type: null,

	prefix: null,

	message: null,

	// The raw message originally received from the server,
	// before any parsing:
	raw_message: null

});

module.exports = ServerMessage;
