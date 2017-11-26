
var
	extend        = require('../../utility/extend'),
	Message_Reply = require('../../message/reply'),
	Enum_Replies  = require('../../enum/replies');



class Message_Reply_ChannelUrl extends Message_Reply {

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

extend(Message_Reply_ChannelUrl.prototype, {
	reply:       Enum_Replies.RPL_CHANNEL_URL,
	abnf:        '<channel-name> " :" <channel-url>',
	channel_url: null
});

module.exports = Message_Reply_ChannelUrl;
