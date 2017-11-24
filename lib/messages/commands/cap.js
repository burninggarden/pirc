
var
	extend         = req('/lib/utilities/extend'),
	CommandMessage = req('/lib/messages/command'),
	Enum_Commands  = req('/lib/enum/commands');


class CapMessage extends CommandMessage {

	getValuesForParameters() {
		return { };
	}

	setValuesFromParameters() {
		// Noop for now...
	}

}

extend(CapMessage.prototype, {
	command: Enum_Commands.CAP,
	abnf:    '"???"'
});

module.exports = CapMessage;
