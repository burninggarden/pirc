
var
	extend       = req('/lib/utility/extend'),
	ReplyMessage = req('/lib/message/reply'),
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
