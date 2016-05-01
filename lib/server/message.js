var req = require('req');

var
	extend           = req('/utilities/extend'),
	Message          = req('/lib/message'),
	ResponseCodes    = req('/constants/response-codes'),
	CharacterClasses = req('/constants/character-classes');


class ServerMessage extends Message {

	validate() {
		if (this.hasResponseType()) {
			this.validateResponseType();
		} else {
			this.validateCommand();
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

}

extend(ServerMessage.prototype, {
	prefix: null
});

module.exports = ServerMessage;
