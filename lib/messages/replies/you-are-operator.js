
var
	extend       = req('/lib/utilities/extend'),
	ReplyMessage = req('/lib/messages/reply'),
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
