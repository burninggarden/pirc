
var
	extend       = req('/lib/utilities/extend'),
	ReplyMessage = req('/lib/messages/reply'),
	Replies      = req('/lib/constants/replies');

class EndOfMotdMessage extends ReplyMessage {

	getValuesForParameters() {
		return { };
	}

	setValuesFromParameters() {
		// Deliberately a noop.
	}

}

extend(EndOfMotdMessage.prototype, {

	reply: Replies.RPL_ENDOFMOTD,
	body:  'End of /MOTD command'

});

module.exports = EndOfMotdMessage;
