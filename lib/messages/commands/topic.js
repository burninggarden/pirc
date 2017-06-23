var
	extend         = req('/lib/utilities/extend'),
	CommandMessage = req('/lib/messages/command'),
	Commands       = req('/lib/constants/commands');

class TopicMessage extends CommandMessage {

	setTopic(topic) {
		this.topic = topic;
	}

	getTopic() {
		return this.topic;
	}

	hasTopic() {
		return this.topic !== null;
	}

	getValuesForParameters() {
		return {
			topic: this.getTopic()
		};
	}

	setValuesFromParameters(parameters) {
		this.setTopic(parameters.get('topic'));
	}

}

extend(TopicMessage.prototype, {
	command: Commands.TOPIC,
	abnf:    '<channel-name> [ <topic> ]',
	topic:   null
});

module.exports = TopicMessage;
