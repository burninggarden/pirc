
var
	extend       = req('/lib/utilities/extend'),
	ReplyMessage = req('/lib/messages/reply'),
	Replies      = req('/lib/constants/replies');



class ChannelTopicMessage extends ReplyMessage {

	getChannelTopic() {
		return this.channel_topic;
	}

	setChannelTopic(channel_topic) {
		this.channel_topic = channel_topic;
		return this;
	}

	getValuesForParameters() {
		return {
			channel_topic: this.getChannelTopic()
		};
	}

	setValuesFromParameters(parameters) {
		this.setChannelTopic(parameters.get('channel_topic'));
	}

}

extend(ChannelTopicMessage.prototype, {
	reply:         Replies.RPL_TOPIC,
	abnf:          '<channel-name> " :" <channel-topic>',
	channel_topic: null
});

module.exports = ChannelTopicMessage;
