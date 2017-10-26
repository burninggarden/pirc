
var
	extend       = req('/lib/utilities/extend'),
	ReplyMessage = req('/lib/messages/reply'),
	Replies      = req('/lib/constants/replies');

class NowAwayMessage extends ReplyMessage {

	getValuesForParameters() {
		return { };
	}

	setValuesFromParameters() {
		// Deliberately a noop.
	}

}

extend(NowAwayMessage.prototype, {

	reply: Replies.RPL_NOWAWAY,
	abnf:  '":You have been marked as being away"'

});

module.exports = NowAwayMessage;
