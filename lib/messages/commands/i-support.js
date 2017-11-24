
var
	extend         = req('/lib/utilities/extend'),
	CommandMessage = req('/lib/messages/command'),
	Enum_Commands  = req('/lib/enum/commands');


class ISupportMessage extends CommandMessage {

	serializeParameters() {
		throw new Error('implement');
	}

	applyParsedParameters() {
		throw new Error('implement');
	}

}

extend(ISupportMessage.prototype, {
	command: Enum_Commands.ISUPPORT
});

module.exports = ISupportMessage;
