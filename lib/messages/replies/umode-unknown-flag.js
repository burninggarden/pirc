
var
	extend       = req('/lib/utilities/extend'),
	ReplyMessage = req('/lib/messages/reply'),
	Replies      = req('/lib/constants/replies');


class UModeUnknownFlagMessage extends ReplyMessage {

	getValuesForParameters() {
		return { };
	}

	setValuesFromParameters() {
		// Deliberately a noop.
	}

}

extend(UModeUnknownFlagMessage.prototype, {
	reply: Replies.ERR_UMODEUNKNOWNFLAG,
	abnf:  '":Unknown MODE flag"'
});

module.exports = UModeUnknownFlagMessage;
