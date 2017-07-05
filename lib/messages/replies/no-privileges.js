
var
	extend       = req('/lib/utilities/extend'),
	ReplyMessage = req('/lib/messages/reply'),
	Replies      = req('/lib/constants/replies');


class NoPrivilegesMessage extends ReplyMessage {

	getValuesForParameters() {
		return { };
	}

	setValuesFromParameters() {
		// Deliberately a noop.
	}

}

extend(NoPrivilegesMessage.prototype, {

	reply: Replies.ERR_NOPRIVILEGES,
	abnf:  '":Permission Denied- You\'re not an IRC operator"'

});

module.exports = NoPrivilegesMessage;
