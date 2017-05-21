
var
	extend        = req('/lib/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	Commands      = req('/lib/constants/commands');


class ServerWhowasMessage extends ServerMessage {

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

extend(ServerWhowasMessage.prototype, {
	command: Commands.WHOWAS

});

module.exports = ServerWhowasMessage;
