
var
	extend        = req('/lib/utility/extend'),
	Message_Reply = req('/lib/message/reply'),
	Enum_Replies  = req('/lib/enum/replies');


class Message_Reply_WhoisChannels extends Message_Reply {

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

extend(Message_Reply_WhoisChannels.prototype, {

	reply: Enum_Replies.RPL_WHOISCHANNELS,
	abnf:  '<nick> " :" *( <nick-channel> " " )'

});

module.exports = Message_Reply_WhoisChannels;
