var
	extend       = req('/lib/utilities/extend'),
	ReplyMessage = req('/lib/messages/reply'),
	Replies      = req('/lib/constants/replies');


class WelcomeMessage extends ReplyMessage {

	getUserIdentifier() {
		var user_details = this.getUserDetails();

		return user_details.getIdentifier();
	}

	getValuesForParameters() {
		return {
			user_identifier: this.getUserIdentifier()
		};
	}

	setValuesFromParameters(parameters) {
		var user_identifier = parameters.get('user_identifier');

		this.setUserIdentifier(user_identifier);
	}

}


extend(WelcomeMessage.prototype, {
	reply: Replies.RPL_WELCOME
});

module.exports = WelcomeMessage;
