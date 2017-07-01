var
	extend         = req('/lib/utilities/extend'),
	CommandMessage = req('/lib/messages/command'),
	Commands       = req('/lib/constants/commands');

class TopicMessage extends CommandMessage {

	setChannelName(channel_name) {
		this.channel_name = channel_name;
		return this;
	}

	getChannelName() {
		return this.channel_name;
	}

	setChannelTopic(channel_topic) {
		this.channel_topic = channel_topic;
	}

	getChannelTopic() {
		return this.channel_topic;
	}

	hasChannelTopic() {
		return this.channel_topic !== null;
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

extend(TopicMessage.prototype, {
	command:       Commands.TOPIC,
	abnf:          '<channel-name> [ " :" <channel-topic> ]',
	channel_topic: null,
	channel_name:  null
});

module.exports = TopicMessage;
