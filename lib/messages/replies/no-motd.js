
var
	extend       = req('/lib/utilities/extend'),
	ReplyMessage = req('/lib/messages/reply'),
	Replies      = req('/lib/constants/replies');


class NoMotdMessage extends ReplyMessage {

	getValuesForParameters() {
		return { };
	}

	setValuesFromParameters() {
		// Deliberately a noop.
	}

}

extend(NoMotdMessage.prototype, {
	reply: Replies.ERR_NOMOTD,
	abnf:  '":MOTD File is missing"'
});

module.exports = NoMotdMessage;
