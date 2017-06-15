
var
	extend       = req('/lib/utilities/extend'),
	ReplyMessage = req('/lib/messages/reply'),
	Replies      = req('/lib/constants/replies');



class ChannelUrlMessage extends ReplyMessage {

	getUrl() {
		return this.getBody();
	}

	setUrl(url) {
		return this.setBody(url);
	}

	serializeParameters() {
		var
			targets      = this.serializeTargets(),
			channel_name = this.getChannelDetails().getName(),
			url          = this.getUrl();

		return `${targets} ${channel_name} :${url}`;
	}

	applyParsedParameters(middle_parameters, trailing_parameter) {
		this.getChannelDetails().setName(middle_parameters.pop());
		this.setUrl(trailing_parameter);
	}

}

extend(ChannelUrlMessage.prototype, {
	reply: Replies.RPL_CHANNEL_URL
});

module.exports = ChannelUrlMessage;
