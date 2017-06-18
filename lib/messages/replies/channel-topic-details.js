
var
	extend       = req('/lib/utilities/extend'),
	ReplyMessage = req('/lib/messages/reply'),
	Replies      = req('/lib/constants/replies');


class ChannelTopicDetailsMessage extends ReplyMessage {

	getValuesForParameters() {
		return {
			channel_name: this.getChannelName(),
			user_id:      this.getUserId(),
			nick:         this.getNick(),
			timestamp:    this.getTimestamp()
		};
	}

	setValuesFromParameters(parameters) {
		this.setChannelName(parameters.get('channel_name'));
		this.setUserId(parameters.get('user_id'));
		this.setNick(parameters.get('nick'));
		this.setTimestamp(parameters.get('timestamp'));
	}

}

extend(ChannelTopicDetailsMessage.prototype, {
	reply: Replies.RPL_TOPICWHOTIME
});

module.exports = ChannelTopicDetailsMessage;
