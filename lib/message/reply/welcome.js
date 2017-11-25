var
	extend        = req('/lib/utility/extend'),
	Message_Reply = req('/lib/message/reply'),
	Enum_Replies  = req('/lib/enum/replies');


class Message_Reply_Welcome extends Message_Reply {

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


extend(Message_Reply_Welcome.prototype, {
	reply:   Enum_Replies.RPL_WELCOME,
	abnf:    '"Welcome to the Internet Relay Network " <user-id>',
	user_id: null
});

module.exports = Message_Reply_Welcome;
