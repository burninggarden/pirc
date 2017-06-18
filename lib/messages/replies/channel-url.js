
var
	extend       = req('/lib/utilities/extend'),
	ReplyMessage = req('/lib/messages/reply'),
	Replies      = req('/lib/constants/replies');



class ChannelUrlMessage extends ReplyMessage {

	getChannelUrl() {
		return this.channel_url;
	}

	setChannelUrl(url) {
		this.channel_url = url;
		return this;
	}

	getValuesForParameters() {
		return {
			channel_name: this.getChannelName(),
			channel_url:  this.getChannelUrl()
		};
	}

	setValuesFromParameters(parameters) {
		this.setChannelName(parameters.get('channel_name'));
		this.setChannelUrl(parameters.get('channel_url'));
	}

}

extend(ChannelUrlMessage.prototype, {
	reply:       Replies.RPL_CHANNEL_URL,
	channel_url: null
});

module.exports = ChannelUrlMessage;
