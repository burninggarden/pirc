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
			server_details    = this.getServerDetails(),
			client_details    = this.getClientDetails(),
			server_name       = server_details.getName(),
			client_identifier = client_details.getIdentifier();

		return `Welcome to ${server_name}, ${client_identifier}`;
	}

}


extend(ServerWelcomeMessage.prototype, {
	reply_numeric: ReplyNumerics.RPL_WELCOME
});

module.exports = ServerWelcomeMessage;
