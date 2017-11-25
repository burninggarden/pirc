
var
	extend        = req('/lib/utility/extend'),
	Message_Reply = req('/lib/message/reply'),
	Enum_Replies  = req('/lib/enum/replies');


class Message_Reply_NotRegistered extends Message_Reply {

	getValuesForParameters() {
		return { };
	}

	setValuesFromParameters() {
		// Deliberately a noop.
	}

}

extend(Message_Reply_NotRegistered.prototype, {
	reply: Enum_Replies.ERR_NOTREGISTERED,
	abnf:  '":You have not registered"'
});

module.exports = Message_Reply_NotRegistered;
