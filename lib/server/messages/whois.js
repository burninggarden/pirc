
var
	extend        = req('/lib/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	Commands      = req('/lib/constants/commands');


class ServerWhoisMessage extends ServerMessage {

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

extend(ServerWhoisMessage.prototype, {
	command: Commands.WHOIS

});

module.exports = ServerWhoisMessage;
