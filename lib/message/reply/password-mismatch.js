
var
	extend       = req('/lib/utility/extend'),
	ReplyMessage = req('/lib/message/reply'),
	Enum_Replies = req('/lib/enum/replies');

class PasswordMismatchMessage extends ReplyMessage {

	getValuesForParameters() {
		return { };
	}

	setValuesFromParameters() {
		// Deliberately a noop.
	}

}

extend(PasswordMismatchMessage.prototype, {

	reply: Enum_Replies.ERR_PASSWDMISMATCH,
	abnf:  '":Password incorrect"'

});

module.exports = PasswordMismatchMessage;
