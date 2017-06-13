
var
	extend        = req('/lib/utilities/extend'),
	ReplyMessage  = req('/lib/messages/reply'),
	ReplyNumerics = req('/lib/constants/reply-numerics');



class ChannelTopicMessage extends ReplyMessage {

	getTopic() {
		return this.getBody();
	}

	setTopic(topic) {
		return this.setBody(topic);
	}

	serializeParameters() {
		var
			targets      = this.serializeTargets(),
			channel_name = this.getChannelDetails().getName(),
			topic        = this.getTopic();

		return `${targets} ${channel_name} :${topic}`;
	}

	applyParsedParameters(middle_parameters, trailing_parameter) {
		this.getChannelDetails().setName(middle_parameters.pop());
		this.setTopic(trailing_parameter);
	}

}

extend(ChannelTopicMessage.prototype, {
	reply_numeric: ReplyNumerics.RPL_TOPIC
});

module.exports = ChannelTopicMessage;