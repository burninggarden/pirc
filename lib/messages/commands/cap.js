
var
	extend         = req('/lib/utilities/extend'),
	CommandMessage = req('/lib/messages/command'),
	Commands       = req('/lib/constants/commands');


class CapMessage extends CommandMessage {

	serializeParameters() {
		throw new Error('implement');
	}

	applyParsedParameters() {
		throw new Error('implement');
	}

}

extend(CapMessage.prototype, {
	command: Commands.CAP
});

module.exports = CapMessage;
