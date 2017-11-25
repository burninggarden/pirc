
var
	extend         = req('/lib/utility/extend'),
	CommandMessage = req('/lib/message/command'),
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
