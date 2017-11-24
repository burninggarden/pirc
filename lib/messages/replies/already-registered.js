
var
	extend       = req('/lib/utilities/extend'),
	ReplyMessage = req('/lib/messages/reply'),
	Enum_Replies = req('/lib/enum/replies');


class AlreadyRegisteredMessage extends ReplyMessage {

	getValuesForParameters() {
		return { };
	}

	setValuesFromParameters() {
		// Deliberately a noop.
	}

}

extend(AlreadyRegisteredMessage.prototype, {
	reply: Enum_Replies.ERR_ALREADYREGISTRED,
	abnf:  '":Unauthorized command (already registered)"'
});

module.exports = AlreadyRegisteredMessage;
