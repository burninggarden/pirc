
var
	extend       = req('/lib/utilities/extend'),
	ReplyMessage = req('/lib/messages/reply'),
	Enum_Replies = req('/lib/enum/replies');

class EndOfMotdMessage extends ReplyMessage {

	getValuesForParameters() {
		return { };
	}

	setValuesFromParameters() {
		// Deliberately a noop.
	}

}

extend(EndOfMotdMessage.prototype, {

	reply: Enum_Replies.RPL_ENDOFMOTD,
	abnf:  '":End of MOTD command"'

});

module.exports = EndOfMotdMessage;
