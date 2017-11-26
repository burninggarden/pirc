
var
	extend        = require('../../utility/extend'),
	Message_Reply = require('../../message/reply'),
	Enum_Replies  = require('../../enum/replies');


class Message_Reply_AlreadyRegistered extends Message_Reply {

	getValuesForParameters() {
		return { };
	}

	setValuesFromParameters() {
		// Deliberately a noop.
	}

}

extend(Message_Reply_AlreadyRegistered.prototype, {
	reply: Enum_Replies.ERR_ALREADYREGISTRED,
	abnf:  '":Unauthorized command (already registered)"'
});

module.exports = Message_Reply_AlreadyRegistered;
