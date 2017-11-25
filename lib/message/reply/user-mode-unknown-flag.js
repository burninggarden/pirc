
var
	extend       = req('/lib/utility/extend'),
	ReplyMessage = req('/lib/message/reply'),
	Enum_Replies = req('/lib/enum/replies');


class UserModeUnknownFlagMessage extends ReplyMessage {

	getValuesForParameters() {
		return { };
	}

	setValuesFromParameters() {
		// Deliberately a noop.
	}

}

extend(UserModeUnknownFlagMessage.prototype, {
	reply: Enum_Replies.ERR_UMODEUNKNOWNFLAG,
	abnf:  '":Unknown MODE flag"'
});

module.exports = UserModeUnknownFlagMessage;
