
var
	extend        = require('../../utility/extend'),
	Message_Reply = require('../../message/reply'),
	Enum_Replies  = require('../../enum/replies');

class Message_Reply_PasswordMismatch extends Message_Reply {

	getValuesForParameters() {
		return { };
	}

	setValuesFromParameters() {
		// Deliberately a noop.
	}

}

extend(Message_Reply_PasswordMismatch.prototype, {

	reply: Enum_Replies.ERR_PASSWDMISMATCH,
	abnf:  '":Password incorrect"'

});

module.exports = Message_Reply_PasswordMismatch;
