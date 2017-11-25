
var
	extend          = req('/lib/utility/extend'),
	Message_Command = req('/lib/message/command'),
	Enum_Commands   = req('/lib/enum/commands');


class Message_Command_Who extends Message_Command {

	getValuesForParameters() {
		throw new Error('implement');
	}

	setValuesFromParameters(parameters) {
		throw new Error('implement');
	}

}

extend(Message_Command_Who.prototype, {
	command: Enum_Commands.WHO,
	abnf:    '[ <mask> [ <operator-flag> ] ]'
});

module.exports = Message_Command_Who;
