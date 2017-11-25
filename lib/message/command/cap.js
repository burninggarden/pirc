
var
	extend         = req('/lib/utility/extend'),
	CommandMessage = req('/lib/message/command'),
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
