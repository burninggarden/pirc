
var
	extend          = require('../../utility/extend'),
	Message_Command = require('../../message/command'),
	Enum_Commands   = require('../../enum/commands');


class Message_Command_ISupport extends Message_Command {

	serializeParameters() {
		throw new Error('implement');
	}

	applyParsedParameters() {
		throw new Error('implement');
	}

}

extend(Message_Command_ISupport.prototype, {
	command: Enum_Commands.ISUPPORT
});

module.exports = Message_Command_ISupport;
