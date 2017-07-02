
var
	extend            = req('/lib/utilities/extend'),
	ReplyMessage      = req('/lib/messages/reply'),
	Replies           = req('/lib/constants/replies'),
	NotOnChannelError = req('/lib/errors/not-on-channel');


class NotOnChannelMessage extends ReplyMessage {

	setChannelName(channel_name) {
		this.channel_name = channel_name;
		return this;
	}

	getChannelName() {
		return this.channel_name;
	}

	getValuesForParameters() {
		return {
			channel_name: this.getChannelName()
		};
	}

	setValuesFromParameters(parameters) {
		this.setChannelName(parameters.get('channel_name'));
	}

	toError() {
		return new NotOnChannelError(this.getChannelName());
	}

}

extend(NotOnChannelMessage.prototype, {
	reply:        Replies.ERR_NOTONCHANNEL,
	abnf:         '<channel-name> " :You\'re not on that channel"',
	channel_name: null
});

module.exports = NotOnChannelMessage;
