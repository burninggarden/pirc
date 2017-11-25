
var
	extend       = req('/lib/utility/extend'),
	ReplyMessage = req('/lib/message/reply'),
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
