
var
	extend          = req('/lib/utility/extend'),
	Message_Command = req('/lib/message/command'),
	Enum_Commands   = req('/lib/enum/commands');


class Message_Command_Cap extends Message_Command {

	getValuesForParameters() {
		return { };
	}

	setValuesFromParameters() {
		// Noop for now...
	}

}

extend(Message_Command_Cap.prototype, {
	command: Enum_Commands.CAP,
	abnf:    '"???"'
});

module.exports = Message_Command_Cap;
