
var
	extend       = req('/lib/utility/extend'),
	ReplyMessage = req('/lib/message/reply'),
	Enum_Replies = req('/lib/enum/replies');


class NoChannelTopicMessage extends ReplyMessage {

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

extend(NoChannelTopicMessage.prototype, {
	reply:        Enum_Replies.RPL_NOTOPIC,
	abnf:         '<channel-name> " :No topic is set"',
	channel_name: null
});

module.exports = NoChannelTopicMessage;
