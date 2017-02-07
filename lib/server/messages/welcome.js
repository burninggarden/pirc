var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ReplyNumerics = req('/constants/reply-numerics');


class ServerWelcomeMessage extends ServerMessage {

	isFromServer() {
		return true;
	}

	getBody() {
		var
			server_details  = this.getServerDetails(),
			user_details    = this.getUserDetails(),
			server_name     = server_details.getName(),
			user_identifier = user_details.getIdentifier();

		return `Welcome to ${server_name}, ${user_identifier}`;
	}

}


extend(ServerWelcomeMessage.prototype, {
	reply_numeric: ReplyNumerics.RPL_WELCOME
});

module.exports = ServerWelcomeMessage;
