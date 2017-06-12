
var
	extend         = req('/lib/utilities/extend'),
	CommandMessage = req('/lib/messages/command'),
	Commands       = req('/lib/constants/commands');


class PassMessage extends CommandMessage {

	serializeParameters() {
		throw new Error('implement');
	}

	applyParsedParameters() {
		throw new Error('implement');
	}

}

extend(PassMessage.prototype, {
	command: Commands.PASS
});

module.exports = PassMessage;
