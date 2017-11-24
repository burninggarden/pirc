
var
	extend       = req('/lib/utilities/extend'),
	ReplyMessage = req('/lib/messages/reply'),
	Enum_Replies = req('/lib/enum/replies');


class NoSuchChannelMessage extends ReplyMessage {

	setChannelName(channel_name) {
		this.channel_name = channel_name;
		return this;
	}

	getChannelName() {
		return this.channel_name;
	}

	getValuesForParameters() {
		return {
			attempted_channel_name: this.getChannelName()
		};
	}

	setValuesFromParameters(parameters) {
		this.setChannelName(parameters.get('attempted_channel_name'));
	}

}

extend(NoSuchChannelMessage.prototype, {
	reply:        Enum_Replies.ERR_NOSUCHCHANNEL,
	abnf:         '<attempted-channel-name> " :No such channel"',
	channel_name: null
});

module.exports = NoSuchChannelMessage;
