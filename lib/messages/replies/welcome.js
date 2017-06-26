var
	extend       = req('/lib/utilities/extend'),
	ReplyMessage = req('/lib/messages/reply'),
	Replies      = req('/lib/constants/replies');


class WelcomeMessage extends ReplyMessage {

	getUserId() {
		return this.user_id;
	}

	setUserId(user_id) {
		this.user_id = user_id;
		return this;
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
	reply:   Replies.RPL_WELCOME,
	abnf:    '"Welcome to the Internet Relay Network " <user-id>',
	user_id: null
});

module.exports = WelcomeMessage;
