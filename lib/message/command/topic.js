var
	extend          = require('../../utility/extend'),
	Message_Command = require('../../message/command'),
	Enum_Commands   = require('../../enum/commands');

class Message_Command_Topic extends Message_Command {

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

extend(Message_Command_Topic.prototype, {
	command:       Enum_Commands.TOPIC,
	abnf:          '<channel-name> [ " :" <channel-topic> ]',
	channel_topic: null,
	channel_name:  null
});

module.exports = Message_Command_Topic;
