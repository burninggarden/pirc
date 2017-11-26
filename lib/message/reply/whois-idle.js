
var
	extend        = require('../../utility/extend'),
	Message_Reply = require('../../message/reply'),
	Enum_Replies  = require('../../enum/replies');


class Message_Reply_WhoisIdle extends Message_Reply {

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

extend(Message_Reply_WhoisIdle.prototype, {

	reply: Enum_Replies.RPL_WHOISIDLE,
	abnf:  '<nickname> " " <seconds-idle> " :seconds idle"'

});

module.exports = Message_Reply_WhoisIdle;
