
var
	extend        = req('/lib/utilities/extend'),
	ClientMessage = req('/lib/client/message'),
	Commands      = req('/lib/constants/commands');


class ClientPassMessage extends ClientMessage {

	serializeParams() {
		throw new Error('implement');
	}

	applyParsedParams() {
		throw new Error('implement');
	}

}

extend(ClientPassMessage.prototype, {
	command: Commands.PASS
});

module.exports = ClientPassMessage;
