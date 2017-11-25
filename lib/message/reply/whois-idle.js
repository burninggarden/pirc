
var
	extend       = req('/lib/utility/extend'),
	ReplyMessage = req('/lib/message/reply'),
	Enum_Replies = req('/lib/enum/replies');


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

	reply: Enum_Replies.RPL_WHOISIDLE,
	abnf:  '<nickname> " " <seconds-idle> " :seconds idle"'

});

module.exports = WhoisIdleMessage;
