
var
	extend       = req('/lib/utilities/extend'),
	ReplyMessage = req('/lib/messages/reply'),
	Replies      = req('/lib/constants/replies');

class RestrictedMessage extends ReplyMessage {

	getValuesForParameters() {
		return { };
	}

	setValuesFromParameters() {
		// Deliberately a noop.
	}

}

extend(RestrictedMessage.prototype, {

	reply: Replies.ERR_RESTRICTED,
	abnf:  '":Your connection is restricted!"'

});

module.exports = RestrictedMessage;
