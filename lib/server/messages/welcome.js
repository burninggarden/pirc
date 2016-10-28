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

	serializeParams() {
		var
			targets = this.serializeTargets(),
			body    = this.getBody();

		return `${targets} :${body}`;
	}

	applyParsedParams(middle_params, trailing_param) {
		if (middle_params.length !== 0) {
			throw new Error('Invalid middle params');
		}

		this.setBody(trailing_param);
	}

}


extend(ServerWelcomeMessage.prototype, {
	reply_numeric: ReplyNumerics.RPL_WELCOME
});

module.exports = ServerWelcomeMessage;
