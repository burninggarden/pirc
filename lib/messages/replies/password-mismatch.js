
var
	extend       = req('/lib/utilities/extend'),
	ReplyMessage = req('/lib/messages/reply'),
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
