var
	extend       = req('/lib/utilities/extend'),
	ReplyMessage = req('/lib/messages/reply'),
	Replies      = req('/lib/constants/replies');


class WelcomeMessage extends ReplyMessage {

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
	reply: Replies.RPL_WELCOME
});

module.exports = WelcomeMessage;
