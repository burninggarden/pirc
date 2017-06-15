var
	extend        = req('/lib/utilities/extend'),
	ReplyMessage  = req('/lib/messages/reply'),
	ReplyNumerics = req('/lib/constants/reply-numerics');


class WelcomeMessage extends ReplyMessage {

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

}


extend(WelcomeMessage.prototype, {
	reply_numeric: ReplyNumerics.RPL_WELCOME
});

module.exports = WelcomeMessage;
