
var
	extend       = req('/lib/utilities/extend'),
	ReplyMessage = req('/lib/messages/reply'),
	Enum_Replies = req('/lib/enum/replies');



class AwayMessage extends ReplyMessage {

	getValuesForParameters() {
		return {
			nickname:     this.getNickname(),
			seconds_away: this.getSecondsAway(),
			away_message: this.getAwayMessage()
		};
	}

	setValuesFromParameters(parameters) {
		this.setNickname(parameters.get('nickname'));
		this.setSecondsAway(parameters.get('seconds_away'));
		this.setAwayMessage(parameters.get('away_message'));
	}

}

extend(AwayMessage.prototype, {

	reply: Enum_Replies.RPL_AWAY,
	abnf:  '<nick> " :" <away-message>'

});

module.exports = AwayMessage;
