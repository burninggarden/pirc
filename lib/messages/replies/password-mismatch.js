
var
	extend       = req('/lib/utilities/extend'),
	ReplyMessage = req('/lib/messages/reply'),
	Replies      = req('/lib/constants/replies');

class PasswordMismatchMessage extends ReplyMessage {

	getValuesForParameters() {
		return { };
	}

	setValuesFromParameters() {
		// Deliberately a noop.
	}

}

extend(PasswordMismatchMessage.prototype, {

	reply: Replies.ERR_PASSWDMISMATCH,
	abnf:  '":Password incorrect"'

});

module.exports = PasswordMismatchMessage;
