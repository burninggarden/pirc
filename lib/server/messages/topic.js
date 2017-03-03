var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	Commands      = req('/constants/commands');


class ServerTopicMessage extends ServerMessage {

	serializeParams() {
		var
			targets = this.serializeTargets(),
			topic   = this.getTopic();

		return `${targets} :${topic}`;
	}

	applyParsedParams(middle_params, trailing_param) {
		this.getChannelDetails().setName(middle_params.pop());
		this.setTopic(trailing_param);
	}

	setTopic(topic) {
		this.topic = topic;
	}

	getTopic() {
		return this.topic;
	}

}

function fromInboundMessage(inbound_message) {
	var message = new ServerTopicMessage();

	message.setChannelDetails(inbound_message.getChannelDetails());
	message.setTopic(inbound_message.getTopic());

	return message;
}

ServerTopicMessage.fromInboundMessage = fromInboundMessage;


extend(ServerTopicMessage.prototype, {
	command: Commands.TOPIC,

	topic:   null
});

module.exports = ServerTopicMessage;
