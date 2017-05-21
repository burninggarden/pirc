
var
	extend        = req('/lib/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	Commands      = req('/lib/constants/commands');


class ServerUserMessage extends ServerMessage {

	isFromServer() {
		return false;
	}

	serializeParameters() {
		throw new Error('implement');
	}

	applyParsedParameters(middle_parameters, trailing_parameter) {
		throw new Error('implement');
	}

}

extend(ServerUserMessage.prototype, {
	command: Commands.USER

});

module.exports = ServerUserMessage;
