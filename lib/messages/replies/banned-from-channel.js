
var
	extend       = req('/lib/utilities/extend'),
	ReplyMessage = req('/lib/messages/reply'),
	Replies      = req('/lib/constants/replies');


class BannedFromChannelMessage extends ReplyMessage {

	getValuesForParameters() {
		return {
			channel_name: this.getChannelName()
		};
	}

	setValuesFromParameters(parameters) {
		this.setChannelName(parameters.get('channel_name'));
	}

}

extend(BannedFromChannelMessage.prototype, {
	reply:        Replies.ERR_BANNEDFROMCHAN,
	channel_name: null
});

module.exports = BannedFromChannelMessage;
