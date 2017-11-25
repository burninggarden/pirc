
var
	extend       = req('/lib/utility/extend'),
	ReplyMessage = req('/lib/message/reply'),
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
