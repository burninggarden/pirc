
var
	extend       = req('/lib/utilities/extend'),
	ReplyMessage = req('/lib/messages/reply'),
	Replies      = req('/lib/constants/replies');


class AlreadyRegisteredMessage extends ReplyMessage {

	getValuesForParameters() {
		return { };
	}

	setValuesFromParameters() {
		// Deliberately a noop.
	}

}

extend(AlreadyRegisteredMessage.prototype, {
	reply: Replies.ERR_ALREADYREGISTRED,
	abnf:  '":Unauthorized command (already registered)"'
});

module.exports = AlreadyRegisteredMessage;
