
var
	extend       = req('/lib/utilities/extend'),
	ReplyMessage = req('/lib/messages/reply'),
	Replies      = req('/lib/constants/replies');


class UsersDontMatchMessage extends ReplyMessage {

	getValuesForParameters() {
		return { };
	}

	setValuesFromParameters() {
		// Deliberately a noop.
	}

}

extend(UsersDontMatchMessage.prototype, {
	reply: Replies.ERR_USERSDONTMATCH,
	abnf:  '":Cannot change mode for other users"'
});

module.exports = UsersDontMatchMessage;
