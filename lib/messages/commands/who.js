
var
	extend         = req('/lib/utilities/extend'),
	CommandMessage = req('/lib/messages/command'),
	Enum_Commands  = req('/lib/enum/commands');


class WhoMessage extends CommandMessage {

	getValuesForParameters() {
		throw new Error('implement');
	}

	setValuesFromParameters(parameters) {
		throw new Error('implement');
	}

}

extend(WhoMessage.prototype, {
	command: Enum_Commands.WHO,
	abnf:    '[ <mask> [ <operator-flag> ] ]'
});

module.exports = WhoMessage;
