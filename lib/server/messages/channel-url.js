
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

	serializeParams() {
		var
			targets      = this.serializeTargets(),
			channel_name = this.getChannelDetails().getName(),
			url          = this.getUrl();

		return `${targets} ${channel_name} :${url}`;
	}

	applyParsedParams(middle_params, trailing_param) {
		this.getChannelDetails().setName(middle_params.pop());
		this.setUrl(trailing_param);
	}

}

extend(ChannelUrlMessage.prototype, {
	reply_numeric: ReplyNumerics.RPL_CHANNEL_URL
});

module.exports = ChannelUrlMessage;
