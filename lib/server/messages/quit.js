
var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	Commands      = req('/constants/commands');


class ServerQuitMessage extends ServerMessage {

	isFromServer() {
		return false;
	}

	isFromClient() {
		return true;
	}

	serializeParams() {
		var body = this.getBody();

		return `:${body}`;
	}

	applyParsedParams(middle_params, trailing_param) {
		this.setBody(trailing_param);
	}

}

extend(ServerQuitMessage.prototype, {
	command: Commands.QUIT
});

module.exports = ServerQuitMessage;
