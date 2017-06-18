
var
	extend            = req('/lib/utilities/extend'),
	ReplyMessage      = req('/lib/messages/reply'),
	Replies           = req('/lib/constants/replies'),
	NotOnChannelError = req('/lib/errors/not-on-channel');


class NotOnChannelMessage extends ReplyMessage {

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
	reply: Replies.ERR_NOTONCHANNEL
});

module.exports = NotOnChannelMessage;
