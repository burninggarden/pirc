
var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	Commands      = req('/constants/commands');


class ServerNickMessage extends ServerMessage {

	isFromServer() {
		return false;
	}

	isFromClient() {
		return true;
	}

	serializeParams() {
		return this.getTargetUserDetails().getNick();
	}

	applyParsedParams(middle_params, trailing_param) {
		var new_nick;

		if (!middle_params.length && trailing_param) {
			new_nick = trailing_param;
		} else {
			new_nick = middle_params[0];
		}

		this.getTargetUserDetails().setNick(new_nick);
	}

}

extend(ServerNickMessage.prototype, {
	command: Commands.NICK

});

module.exports = ServerNickMessage;
