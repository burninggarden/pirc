
var
	extend        = require('../../utility/extend'),
	Message_Reply = require('../../message/reply'),
	Enum_Replies  = require('../../enum/replies');


class Message_Reply_NotOnChannel extends Message_Reply {

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

extend(Message_Reply_NotOnChannel.prototype, {
	reply:        Enum_Replies.ERR_NOTONCHANNEL,
	abnf:         '<channel-name> " :You\'re not on that channel"',
	channel_name: null
});

module.exports = Message_Reply_NotOnChannel;
