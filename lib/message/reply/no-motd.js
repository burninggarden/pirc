
var
	extend        = req('/lib/utility/extend'),
	Message_Reply = req('/lib/message/reply'),
	Enum_Replies  = req('/lib/enum/replies');


class Message_Reply_NoMotd extends Message_Reply {

	getValuesForParameters() {
		return { };
	}

	setValuesFromParameters() {
		// Deliberately a noop.
	}

}

extend(Message_Reply_NoMotd.prototype, {
	reply: Enum_Replies.ERR_NOMOTD,
	abnf:  '":MOTD File is missing"'
});

module.exports = Message_Reply_NoMotd;
