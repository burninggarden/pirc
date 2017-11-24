
var
	extend       = req('/lib/utilities/extend'),
	ReplyMessage = req('/lib/messages/reply'),
	Enum_Replies = req('/lib/enum/replies');


class NoMotdMessage extends ReplyMessage {

	getValuesForParameters() {
		return { };
	}

	setValuesFromParameters() {
		// Deliberately a noop.
	}

}

extend(NoMotdMessage.prototype, {
	reply: Enum_Replies.ERR_NOMOTD,
	abnf:  '":MOTD File is missing"'
});

module.exports = NoMotdMessage;
