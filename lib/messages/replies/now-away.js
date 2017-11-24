
var
	extend       = req('/lib/utilities/extend'),
	ReplyMessage = req('/lib/messages/reply'),
	Enum_Replies = req('/lib/enum/replies');

class NowAwayMessage extends ReplyMessage {

	getValuesForParameters() {
		return { };
	}

	setValuesFromParameters() {
		// Deliberately a noop.
	}

}

extend(NowAwayMessage.prototype, {

	reply: Enum_Replies.RPL_NOWAWAY,
	abnf:  '":You have been marked as being away"'

});

module.exports = NowAwayMessage;
