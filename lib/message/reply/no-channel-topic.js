
var
	extend        = require('../../utility/extend'),
	Message_Reply = require('../../message/reply'),
	Enum_Replies  = require('../../enum/replies');


class Message_Reply_NoChannelTopic extends Message_Reply {

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

extend(Message_Reply_NoChannelTopic.prototype, {
	reply:        Enum_Replies.RPL_NOTOPIC,
	abnf:         '<channel-name> " :No topic is set"',
	channel_name: null
});

module.exports = Message_Reply_NoChannelTopic;
