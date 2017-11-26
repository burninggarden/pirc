
var
	extend        = require('../../utility/extend'),
	Message_Reply = require('../../message/reply'),
	Enum_Replies  = require('../../enum/replies');



class Message_Reply_Away extends Message_Reply {

	getValuesForParameters() {
		return {
			nickname:     this.getNickname(),
			seconds_away: this.getSecondsAway(),
			away_message: this.getMessage_Reply_Away()
		};
	}

	setValuesFromParameters(parameters) {
		this.setNickname(parameters.get('nickname'));
		this.setSecondsAway(parameters.get('seconds_away'));
		this.setMessage_Reply_Away(parameters.get('away_message'));
	}

}

extend(Message_Reply_Away.prototype, {

	reply: Enum_Replies.RPL_AWAY,
	abnf:  '<nick> " :" <away-message>'

});

module.exports = Message_Reply_Away;
