var
	extend        = req('/lib/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ReplyNumerics = req('/lib/constants/reply-numerics');


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

	serializeParameters() {
		return ' ' + this.serializeTargets() + ' :' + this.getBody();
	}

	applyParsedParameters(middle_parameters, trailing_parameter) {
		this.setTargetStrings(middle_parameters);
		this.setBody(trailing_parameter);
	}

}


extend(ServerWelcomeMessage.prototype, {
	bnf:           'Welcome to the <servername> IRC Network, <nick>!<user>@<host>',
	reply_numeric: ReplyNumerics.RPL_WELCOME
});

module.exports = ServerWelcomeMessage;
