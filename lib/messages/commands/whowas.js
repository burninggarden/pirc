

var
	extend        = req('/lib/utilities/extend'),
	ClientMessage = req('/lib/client/message'),
	Commands      = req('/lib/constants/commands');


class ClientWhowasMessage extends ClientMessage {

	serializeParameters() {
		throw new Error('implement');
	}

	applyParsedParameters(middle_parameters, trailing_param) {
		throw new Error('implement');
	}

}

extend(ClientWhowasMessage.prototype, {
	command: Commands.WHOWAS
});

module.exports = ClientWhowasMessage;
