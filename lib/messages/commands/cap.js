
var
	extend        = req('/lib/utilities/extend'),
	ClientMessage = req('/lib/client/message'),
	Commands      = req('/lib/constants/commands');


class ClientCapMessage extends ClientMessage {

	serializeParameters() {
		throw new Error('implement');
	}

	applyParsedParameters() {
		throw new Error('implement');
	}

}

extend(ClientCapMessage.prototype, {
	command: Commands.CAP
});

module.exports = ClientCapMessage;
