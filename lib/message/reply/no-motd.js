
var
	extend       = req('/lib/utility/extend'),
	ReplyMessage = req('/lib/message/reply'),
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
