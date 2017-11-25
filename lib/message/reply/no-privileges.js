
var
	extend       = req('/lib/utility/extend'),
	ReplyMessage = req('/lib/message/reply'),
	Enum_Replies = req('/lib/enum/replies');


class NoPrivilegesMessage extends ReplyMessage {

	getValuesForParameters() {
		return { };
	}

	setValuesFromParameters() {
		// Deliberately a noop.
	}

}

extend(NoPrivilegesMessage.prototype, {

	reply: Enum_Replies.ERR_NOPRIVILEGES,
	abnf:  '":Permission Denied- You\'re not an IRC operator"'

});

module.exports = NoPrivilegesMessage;
