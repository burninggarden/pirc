
var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ReplyNumerics = req('/constants/reply-numerics');



class ChannelTopicMessage extends ServerMessage {

	getTopic() {
		return this.getBody();
	}

	setTopic(topic) {
		return this.setBody(topic);
	}

	serializeParams() {
		var
			targets      = this.serializeTargets(),
			channel_name = this.getChannelDetails().getName(),
			topic        = this.getTopic();

		return `${targets} ${channel_name} :${topic}`;
	}

	applyParsedParams(middle_params, trailing_param) {
		this.getChannelDetails().setName(middle_params.pop());
		this.setTopic(trailing_param);
	}

}

extend(ChannelTopicMessage.prototype, {
	reply_numeric: ReplyNumerics.RPL_TOPIC
});

module.exports = ChannelTopicMessage;
