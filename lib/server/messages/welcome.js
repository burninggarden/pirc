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
			server_details  = this.getLocalServerDetails(),
			user_details    = this.getUserDetails(),
			server_name     = server_details.getName(),
			user_identifier = user_details.getIdentifier();

		return `Welcome to the ${server_name} IRC Network ${user_identifier}`;
	}

	serializeParams() {
		return ' ' + this.serializeTargets() + ' :' + this.getBody();
	}

	applyParsedParams(middle_params, trailing_param) {
		this.setTargetStrings(middle_params);
		this.setBody(trailing_param);
	}

}


extend(ServerWelcomeMessage.prototype, {
	reply_numeric: ReplyNumerics.RPL_WELCOME
});

module.exports = ServerWelcomeMessage;
