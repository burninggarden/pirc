var
	extend        = req('/lib/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	Commands      = req('/lib/constants/commands');


class ServerTopicMessage extends ServerMessage {

	isFromServer() {
		return false;
	}

	getChannelName() {
		return this.getChannelDetails().getName();
	}

	serializeParameters() {
		var
			channel_name = this.getChannelName(),
			topic        = this.getTopic();

		return `${channel_name} :${topic}`;
	}

	applyParsedParameters(middle_parameters, trailing_parameter) {
		this.getChannelDetails().setName(middle_parameters.pop());
		this.setTopic(trailing_parameter);
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
	message.setUserDetails(inbound_message.getUserDetails());
	message.setTopic(inbound_message.getTopic());

	return message;
}

ServerTopicMessage.fromInboundMessage = fromInboundMessage;


extend(ServerTopicMessage.prototype, {
	command: Commands.TOPIC,

	topic:   null
});

module.exports = ServerTopicMessage;
