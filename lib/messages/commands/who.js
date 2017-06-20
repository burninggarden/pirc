
var
	extend         = req('/lib/utilities/extend'),
	CommandMessage = req('/lib/messages/command'),
	Commands       = req('/lib/constants/commands');


class WhoMessage extends CommandMessage {

	getValuesForParameters() {
		throw new Error('implement');
	}

	setValuesFromParameters(parameters) {
		throw new Error('implement');
	}

}

extend(WhoMessage.prototype, {
	command: Commands.WHO
});

module.exports = WhoMessage;
