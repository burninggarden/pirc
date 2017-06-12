

var
	extend         = req('/lib/utilities/extend'),
	CommandMessage = req('/lib/client/message'),
	Commands       = req('/lib/constants/commands');


class WhowasMessage extends CommandMessage {

	serializeParameters() {
		throw new Error('implement');
	}

	applyParsedParameters(middle_parameters, trailing_param) {
		throw new Error('implement');
	}

}

extend(WhowasMessage.prototype, {
	command: Commands.WHOWAS
});

module.exports = WhowasMessage;
