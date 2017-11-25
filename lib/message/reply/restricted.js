
var
	extend       = req('/lib/utility/extend'),
	ReplyMessage = req('/lib/message/reply'),
	Enum_Replies = req('/lib/enum/replies');

class RestrictedMessage extends ReplyMessage {

	getValuesForParameters() {
		return { };
	}

	setValuesFromParameters() {
		// Deliberately a noop.
	}

}

extend(RestrictedMessage.prototype, {

	reply: Enum_Replies.ERR_RESTRICTED,
	abnf:  '":Your connection is restricted!"'

});

module.exports = RestrictedMessage;
