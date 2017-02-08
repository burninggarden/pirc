var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	Commands      = req('/constants/commands');


class ServerTopicMessage extends ServerMessage {

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


extend(ServerTopicMessage.prototype, {
	command: Commands.TOPIC,

	topic:   null
});

module.exports = ServerTopicMessage;
