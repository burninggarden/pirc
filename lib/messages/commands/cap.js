
var
	extend         = req('/lib/utilities/extend'),
	CommandMessage = req('/lib/messages/command'),
	Commands       = req('/lib/constants/commands');


class CapMessage extends CommandMessage {

	getValuesForParameters() {
		return { };
	}

	setValuesFromParameters() {
		// Noop for now...
	}

}

extend(CapMessage.prototype, {
	command: Commands.CAP
});

module.exports = CapMessage;
