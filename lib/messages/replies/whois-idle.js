
var
	extend       = req('/lib/utilities/extend'),
	ReplyMessage = req('/lib/messages/reply'),
	Replies      = req('/lib/constants/replies');


class WhoisIdleMessage extends ReplyMessage {

	getValuesForParameters() {
		return {
			nickname:     this.getNickname(),
			seconds_idle: this.getSecondsIdle()
		};
	}

	setValuesFromParameters(parameters) {
		this.setNickname(parameters.get('nickname'));
		this.setSecondsIdle(parameters.get('seconds_idle'));
	}

}

extend(WhoisIdleMessage.prototype, {

	reply: Replies.RPL_WHOISIDLE,
	abnf:  '<nickname> " " <seconds-idle> " :seconds idle"'

});

module.exports = WhoisIdleMessage;
