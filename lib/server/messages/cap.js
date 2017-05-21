
var
	extend        = req('/lib/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	Commands      = req('/lib/constants/commands');


class ServerCapMessage extends ServerMessage {

	isFromServer() {
		return false;
	}

	serializeParams() {
		throw new Error('implement');
	}

	applyParsedParams(middle_params, trailing_param) {
		throw new Error('implement');
	}

}

extend(ServerCapMessage.prototype, {
	command: Commands.CAP

});

module.exports = ServerCapMessage;
