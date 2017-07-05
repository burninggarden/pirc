
var
	extend       = req('/lib/utilities/extend'),
	ReplyMessage = req('/lib/messages/reply'),
	Replies      = req('/lib/constants/replies');


class NotRegisteredMessage extends ReplyMessage {

	getValuesForParameters() {
		return { };
	}

	setValuesFromParameters() {
		// Deliberately a noop.
	}

}

extend(NotRegisteredMessage.prototype, {
	reply: Replies.ERR_NOTREGISTERED,
	abnf:  '":You have not registered"'
});

module.exports = NotRegisteredMessage;
