
var
	extend       = req('/lib/utility/extend'),
	ReplyMessage = req('/lib/message/reply'),
	Enum_Replies = req('/lib/enum/replies');


class NotRegisteredMessage extends ReplyMessage {

	getValuesForParameters() {
		return { };
	}

	setValuesFromParameters() {
		// Deliberately a noop.
	}

}

extend(NotRegisteredMessage.prototype, {
	reply: Enum_Replies.ERR_NOTREGISTERED,
	abnf:  '":You have not registered"'
});

module.exports = NotRegisteredMessage;
