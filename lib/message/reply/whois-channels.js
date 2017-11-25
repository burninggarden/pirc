
var
	extend       = req('/lib/utility/extend'),
	ReplyMessage = req('/lib/message/reply'),
	Enum_Replies = req('/lib/enum/replies');


class WhoisChannelsMessage extends ReplyMessage {

	getValuesForParameters() {
		return {
			nickname:     this.getNickname(),
			nick_channel: this.getPrefixedChannelNames()
		};
	}

	setValuesFromParameters(parameters) {
		this.setNickname(parameters.get('nickname'));
		this.setPrefixedChannelNames(parameters.getAll('nick_channel'));
	}

}

extend(WhoisChannelsMessage.prototype, {

	reply: Enum_Replies.RPL_WHOISCHANNELS,
	abnf:  '<nick> " :" *( <nick-channel> " " )'

});

module.exports = WhoisChannelsMessage;
