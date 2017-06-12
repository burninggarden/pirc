
var
	extend        = req('/lib/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ReplyNumerics = req('/lib/constants/reply-numerics');



class ChannelUrlMessage extends ServerMessage {

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
	reply_numeric: ReplyNumerics.RPL_CHANNEL_URL
});

module.exports = ChannelUrlMessage;
