
var
	extend       = req('/lib/utility/extend'),
	ReplyMessage = req('/lib/message/reply'),
	Enum_Replies = req('/lib/enum/replies');

class YouAreOperatorMessage extends ReplyMessage {

	getValuesForParameters() {
		return { };
	}

	setValuesFromParameters() {
		// Deliberately a noop.
	}

}

extend(YouAreOperatorMessage.prototype, {

	reply: Enum_Replies.RPL_YOUREOPER,
	abnf:  '":You are now an IRC operator"'

});

module.exports = YouAreOperatorMessage;
