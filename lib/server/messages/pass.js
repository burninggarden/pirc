
var
	extend        = req('/lib/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	Commands      = req('/lib/constants/commands');


class ServerPassMessage extends ServerMessage {

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

extend(ServerPassMessage.prototype, {
	command: Commands.PASS

});

module.exports = ServerPassMessage;
