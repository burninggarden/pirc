
var
	extend        = req('/lib/utility/extend'),
	Message_Reply = req('/lib/message/reply'),
	Enum_Replies  = req('/lib/enum/replies');

class Message_Reply_EndOfMotd extends Message_Reply {

	getValuesForParameters() {
		return { };
	}

	setValuesFromParameters() {
		// Deliberately a noop.
	}

}

extend(Message_Reply_EndOfMotd.prototype, {

	reply: Enum_Replies.RPL_ENDOFMOTD,
	abnf:  '":End of MOTD command"'

});

module.exports = Message_Reply_EndOfMotd;
