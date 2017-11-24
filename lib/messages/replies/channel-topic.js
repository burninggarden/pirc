
var
	extend       = req('/lib/utilities/extend'),
	ReplyMessage = req('/lib/messages/reply'),
	Enum_Replies = req('/lib/enum/replies');



class ChannelTopicMessage extends ReplyMessage {

	getChannelName() {
		return this.channel_name;
	}

	setChannelName(channel_name) {
		this.channel_name = channel_name;
		return this;
	}

	getChannelTopic() {
		return this.channel_topic;
	}

	setChannelTopic(channel_topic) {
		this.channel_topic = channel_topic;
		return this;
	}

	getValuesForParameters() {
		return {
			channel_name:  this.getChannelName(),
			channel_topic: this.getChannelTopic()
		};
	}

	setValuesFromParameters(parameters) {
		this.setChannelName(parameters.get('channel_name'));
		this.setChannelTopic(parameters.get('channel_topic'));
	}

}

extend(ChannelTopicMessage.prototype, {
	reply:         Enum_Replies.RPL_TOPIC,
	abnf:          '<channel-name> " :" <channel-topic>',
	channel_topic: null,
	channel_name:  null
});

module.exports = ChannelTopicMessage;
