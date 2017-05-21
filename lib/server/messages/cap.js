
var
	extend        = req('/lib/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	Commands      = req('/lib/constants/commands');


class ServerCapMessage extends ServerMessage {

	isFromServer() {
		return false;
	}

	serializeParameters() {
		throw new Error('implement');
	}

	applyParsedParameters(middle_parameters) {
		throw new Error('implement');
	}

}

extend(ServerCapMessage.prototype, {
	command: Commands.CAP

});

module.exports = ServerCapMessage;
