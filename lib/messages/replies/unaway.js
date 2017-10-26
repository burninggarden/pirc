
var
	extend       = req('/lib/utilities/extend'),
	ReplyMessage = req('/lib/messages/reply'),
	Replies      = req('/lib/constants/replies');

class UnawayMessage extends ReplyMessage {

	getValuesForParameters() {
		return { };
	}

	setValuesFromParameters(parameters) {
	}

}

extend(UnawayMessage.prototype, {

	reply: Replies.RPL_UNAWAY,
	abnf:  '":You are no longer marked as being away"'

});

module.exports = UnawayMessage;
