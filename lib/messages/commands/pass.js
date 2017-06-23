
var
	extend         = req('/lib/utilities/extend'),
	CommandMessage = req('/lib/messages/command'),
	Commands       = req('/lib/constants/commands');


class PassMessage extends CommandMessage {

	getValuesForParameters() {
		throw new Error('implement');
	}

	setValuesFromParameters() {
		throw new Error('implement');
	}

}

extend(PassMessage.prototype, {
	command: Commands.PASS,
	abnf:    '<password>'
});

module.exports = PassMessage;
