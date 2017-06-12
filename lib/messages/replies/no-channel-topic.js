
var
	extend        = req('/lib/utilities/extend'),
	ReplyMessage  = req('/lib/messages/reply'),
	ReplyNumerics = req('/lib/constants/reply-numerics');


class NoChannelTopicMessage extends ReplyMessage {

	getChannelName() {
		return this.getChannelDetails().getName();
	}

	setChannelName(channel_name) {
		this.getChannelDetails().setName(channel_name);
	}

	serializeParameters() {
		var
			targets      = this.serializeTargets(),
			channel_name = this.getChannelName(),
			body         = this.getBody();

		return `${targets} ${channel_name} :${body}`;
	}

	applyParsedParameters(middle_parameters, trailing_parameter) {
		this.addTargetFromString(middle_parameters.shift());
		this.setChannelName(middle_parameters.shift());
		this.setBody(trailing_parameter);
	}

}

extend(NoChannelTopicMessage.prototype, {
	reply_numeric: ReplyNumerics.RPL_NOTOPIC,
	body:          'No topic is set.'
});

module.exports = NoChannelTopicMessage;
