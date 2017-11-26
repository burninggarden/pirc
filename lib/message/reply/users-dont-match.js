
var
	extend        = require('../../utility/extend'),
	Message_Reply = require('../../message/reply'),
	Enum_Replies  = require('../../enum/replies');


class Message_Reply_UsersDontMatch extends Message_Reply {

	getValuesForParameters() {
		return { };
	}

	setValuesFromParameters() {
		// Deliberately a noop.
	}

}

extend(Message_Reply_UsersDontMatch.prototype, {
	reply: Enum_Replies.ERR_USERSDONTMATCH,
	abnf:  '":Cannot change mode for other users"'
});

module.exports = Message_Reply_UsersDontMatch;
