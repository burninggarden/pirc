
var
	extend       = req('/lib/utilities/extend'),
	ReplyMessage = req('/lib/messages/reply'),
	Replies      = req('/lib/constants/replies');

class EndOfWhoisMessage extends ReplyMessage {

	getValuesForParameters() {
		return {
			nick: this.getNick()
		};
	}

	setValuesFromParameters(parameters) {
		this.setNick(parameters.get('nick'));
	}

}

extend(EndOfWhoisMessage.prototype, {

	reply: Replies.RPL_ENDOFWHOIS

});

module.exports = EndOfWhoisMessage;
