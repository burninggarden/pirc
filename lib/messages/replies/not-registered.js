
var
	extend       = req('/lib/utilities/extend'),
	ReplyMessage = req('/lib/messages/reply'),
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
