var
	extend       = req('/lib/utilities/extend'),
	ReplyMessage = req('/lib/messages/reply'),
	Replies      = req('/lib/constants/replies');


class WelcomeMessage extends ReplyMessage {

	getUserId() {
		return this.getFirstUserTarget().getIdentifier();
	}

	getValuesForParameters() {
		return {
			user_id: this.getUserId()
		};
	}

	setValuesFromParameters(parameters) {
		this.setUserId(parameters.get('user_id'));
	}

}


extend(WelcomeMessage.prototype, {
	reply: Replies.RPL_WELCOME,
	abnf:  '"Welcome to the Internet Relay Network " <user-id>'
});

module.exports = WelcomeMessage;
