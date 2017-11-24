
var
	extend       = req('/lib/utilities/extend'),
	ReplyMessage = req('/lib/messages/reply'),
	Enum_Replies = req('/lib/enum/replies');

class EndOfWhoisMessage extends ReplyMessage {

	getValuesForParameters() {
		return {
			nickname: this.getNickname()
		};
	}

	setValuesFromParameters(parameters) {
		this.setNickname(parameters.get('nickname'));
	}

}

extend(EndOfWhoisMessage.prototype, {

	reply: Enum_Replies.RPL_ENDOFWHOIS,
	abnf:  '<nick> " :End of WHOIS list"'

});

module.exports = EndOfWhoisMessage;
