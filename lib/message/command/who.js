
var
	extend          = require('../../utility/extend'),
	Message_Command = require('../../message/command'),
	Enum_Commands   = require('../../enum/commands');


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
