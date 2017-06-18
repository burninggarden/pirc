
var
	extend       = req('/lib/utilities/extend'),
	ReplyMessage = req('/lib/messages/reply'),
	Replies      = req('/lib/constants/replies');


class WhoisIdleMessage extends ReplyMessage {

	getValuesForParameters() {
		return {
			nick:         this.getNick(),
			seconds_idle: this.getSecondsIdle()
		};
	}

	setValuesFromParameters(parameters) {
		this.setNick(parameters.get('nick'));
		this.setSecondsIdle(parameters.get('seconds_idle'));
	}

}

extend(WhoisIdleMessage.prototype, {

	reply: Replies.RPL_WHOISIDLE

});

module.exports = WhoisIdleMessage;
