
var
	extend        = require('../../utility/extend'),
	Message_Reply = require('../../message/reply'),
	Enum_Replies  = require('../../enum/replies');

class Message_Reply_EndOfWhoisMessage extends Message_Reply {

	getValuesForParameters() {
		return {
			nickname: this.getNickname()
		};
	}

	setValuesFromParameters(parameters) {
		this.setNickname(parameters.get('nickname'));
	}

}

extend(Message_Reply_EndOfWhoisMessage.prototype, {

	reply: Enum_Replies.RPL_ENDOFWHOIS,
	abnf:  '<nick> " :End of WHOIS list"'

});

module.exports = Message_Reply_EndOfWhoisMessage;
