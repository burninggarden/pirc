
var
	extend       = req('/lib/utilities/extend'),
	ReplyMessage = req('/lib/messages/reply'),
	Replies      = req('/lib/constants/replies');


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

	reply: Replies.RPL_WHOISCHANNELS,
	abnf:  '<nick> " :" *( <nick-channel> " " )'

});

module.exports = WhoisChannelsMessage;
