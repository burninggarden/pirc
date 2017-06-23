
var
	extend           = req('/lib/utilities/extend'),
	ReplyMessage     = req('/lib/messages/reply'),
	Replies          = req('/lib/constants/replies'),
	InvalidModeError = req('/lib/errors/invalid-mode'),
	ErrorReasons     = req('/lib/constants/error-reasons');


class UModeUnknownFlagMessage extends ReplyMessage {

	getValuesForParameters() {
		return { };
	}

	setValuesFromParameters() {
		// Deliberately a noop.
	}

	toError() {
		return new InvalidModeError(null, ErrorReasons.UNKNOWN_TYPE);
	}

}

extend(UModeUnknownFlagMessage.prototype, {
	reply: Replies.ERR_UMODEUNKNOWNFLAG,
	abnf:  '":Unknown MODE flag"'
});

module.exports = UModeUnknownFlagMessage;
