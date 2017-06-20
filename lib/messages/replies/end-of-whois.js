
var
	extend       = req('/lib/utilities/extend'),
	ReplyMessage = req('/lib/messages/reply'),
	Replies      = req('/lib/constants/replies');

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

	reply: Replies.RPL_ENDOFWHOIS

});

module.exports = EndOfWhoisMessage;
