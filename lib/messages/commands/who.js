
var
	extend         = req('/lib/utilities/extend'),
	CommandMessage = req('/lib/client/message'),
	Commands       = req('/lib/constants/commands');


class WhoMessage extends CommandMessage {

	serializeParameters() {
		throw new Error('implement');
	}

	applyParsedParameters() {
		throw new Error('implement');
	}

}

extend(WhoMessage.prototype, {
	command: Commands.WHO
});

module.exports = WhoMessage;
