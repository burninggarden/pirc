
var
	extend        = req('/lib/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	Commands      = req('/lib/constants/commands');


class ServerWhoMessage extends ServerMessage {

	isFromServer() {
		return false;
	}

	serializeParameters() {
		throw new Error('implement');
	}

	applyParsedParameters(middle_parameters, trailing_param) {
		throw new Error('implement');
	}

}

extend(ServerWhoMessage.prototype, {
	command: Commands.WHO

});

module.exports = ServerWhoMessage;
