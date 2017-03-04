
var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ReplyNumerics = req('/constants/reply-numerics');


class NoChannelTopicMessage extends ServerMessage {

	getChannelName() {
		return this.getChannelDetails().getName();
	}

	setChannelName(channel_name) {
		this.getChannelDetails().setName(channel_name);
	}

	serializeParams() {
		var
			targets      = this.serializeTargets(),
			channel_name = this.getChannelName(),
			body         = this.getBody();

		return `${targets} ${channel_name} :${body}`;
	}

	applyParsedParams(middle_params, trailing_param) {
		this.addTargetFromString(middle_params.shift());
		this.setChannelName(middle_params.shift());
		this.setBody(trailing_param);
	}

}

extend(NoChannelTopicMessage.prototype, {
	reply_numeric: ReplyNumerics.RPL_NOTOPIC,
	body:          'No topic is set'
});

module.exports = NoChannelTopicMessage;
