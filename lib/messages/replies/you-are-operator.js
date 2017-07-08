
var
	extend       = req('/lib/utilities/extend'),
	ReplyMessage = req('/lib/messages/reply'),
	Replies      = req('/lib/constants/replies');

class YouAreOperatorMessage extends ReplyMessage {

	getValuesForParameters() {
		return { };
	}

	setValuesFromParameters() {
		// Deliberately a noop.
	}

}

extend(YouAreOperatorMessage.prototype, {

	reply: Replies.RPL_YOUREOPER,
	abnf:  '":You are now an IRC operator"'

});

module.exports = YouAreOperatorMessage;
