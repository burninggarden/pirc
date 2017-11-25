
var
	extend       = req('/lib/utility/extend'),
	ReplyMessage = req('/lib/message/reply'),
	Enum_Replies = req('/lib/enum/replies');


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

}

extend(NotOnChannelMessage.prototype, {
	reply:        Enum_Replies.ERR_NOTONCHANNEL,
	abnf:         '<channel-name> " :You\'re not on that channel"',
	channel_name: null
});

module.exports = NotOnChannelMessage;
