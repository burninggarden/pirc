
var
	extend        = req('/lib/utilities/extend'),
	ClientMessage = req('/lib/client/message'),
	Commands      = req('/lib/constants/commands');


class ClientQuitMessage extends ClientMessage {

	serializeParams() {
		throw new Error('implement');
	}

	applyParsedParams() {
		throw new Error('implement');
	}

}

extend(ClientQuitMessage.prototype, {
	command: Commands.QUIT
});

module.exports = ClientQuitMessage;
