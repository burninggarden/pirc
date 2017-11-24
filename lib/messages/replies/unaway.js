
var
	extend       = req('/lib/utilities/extend'),
	ReplyMessage = req('/lib/messages/reply'),
	Enum_Replies = req('/lib/enum/replies');

class UnawayMessage extends ReplyMessage {

	getValuesForParameters() {
		return { };
	}

	setValuesFromParameters(parameters) {
	}

}

extend(UnawayMessage.prototype, {

	reply: Enum_Replies.RPL_UNAWAY,
	abnf:  '":You are no longer marked as being away"'

});

module.exports = UnawayMessage;
