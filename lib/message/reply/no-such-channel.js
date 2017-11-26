
var
	extend        = require('../../utility/extend'),
	Message_Reply = require('../../message/reply'),
	Enum_Replies  = require('../../enum/replies');


class Message_Reply_NoSuchChannel extends Message_Reply {

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

extend(Message_Reply_NoSuchChannel.prototype, {
	reply:        Enum_Replies.ERR_NOSUCHCHANNEL,
	abnf:         '<attempted-channel-name> " :No such channel"',
	channel_name: null
});

module.exports = Message_Reply_NoSuchChannel;
