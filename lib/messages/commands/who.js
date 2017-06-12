
var
	extend        = req('/lib/utilities/extend'),
	ClientMessage = req('/lib/client/message'),
	Commands      = req('/lib/constants/commands');


class ClientWhoMessage extends ClientMessage {

	serializeParameters() {
		throw new Error('implement');
	}

	applyParsedParameters() {
		throw new Error('implement');
	}

}

extend(ClientWhoMessage.prototype, {
	command: Commands.WHO
});

module.exports = ClientWhoMessage;
