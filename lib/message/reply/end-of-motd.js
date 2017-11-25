
var
	extend       = req('/lib/utility/extend'),
	ReplyMessage = req('/lib/message/reply'),
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
