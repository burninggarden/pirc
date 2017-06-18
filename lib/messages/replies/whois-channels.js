
var
	extend       = req('/lib/utilities/extend'),
	ReplyMessage = req('/lib/messages/reply'),
	Replies      = req('/lib/constants/replies');


class WhoisChannelsMessage extends ReplyMessage {

	getValuesForParameters() {
		return {
			nick:         this.getNick(),
			nick_channel: this.getPrefixedChannelNames()
		};
	}

	setValuesFromParameters(parameters) {
		this.setNick(parameters.get('nick'));
		this.setPrefixedChannelNames(parameters.getAll('nick_channel'));
	}

}

extend(WhoisChannelsMessage.prototype, {

	reply: Replies.RPL_WHOISCHANNELS

});

module.exports = WhoisChannelsMessage;
