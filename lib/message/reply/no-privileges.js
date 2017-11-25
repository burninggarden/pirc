
var
	extend        = req('/lib/utility/extend'),
	Message_Reply = req('/lib/message/reply'),
	Enum_Replies  = req('/lib/enum/replies');


class Message_Reply_NoPrivileges extends Message_Reply {

	getValuesForParameters() {
		return { };
	}

	setValuesFromParameters() {
		// Deliberately a noop.
	}

}

extend(Message_Reply_NoPrivileges.prototype, {

	reply: Enum_Replies.ERR_NOPRIVILEGES,
	abnf:  '":Permission Denied- You\'re not an IRC operator"'

});

module.exports = Message_Reply_NoPrivileges;
