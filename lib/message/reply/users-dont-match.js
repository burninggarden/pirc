
var
	extend       = req('/lib/utility/extend'),
	ReplyMessage = req('/lib/message/reply'),
	Enum_Replies = req('/lib/enum/replies');


class UsersDontMatchMessage extends ReplyMessage {

	getValuesForParameters() {
		return { };
	}

	setValuesFromParameters() {
		// Deliberately a noop.
	}

}

extend(UsersDontMatchMessage.prototype, {
	reply: Enum_Replies.ERR_USERSDONTMATCH,
	abnf:  '":Cannot change mode for other users"'
});

module.exports = UsersDontMatchMessage;
