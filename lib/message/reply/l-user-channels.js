
var
	extend        = require('../../utility/extend'),
	Message_Reply = require('../../message/reply'),
	Enum_Replies  = require('../../enum/replies');

class Message_Reply_LUserChannels extends Message_Reply {

	getChannelCount() {
		return this.channel_count;
	}

	setChannelCount(channel_count) {
		this.channel_count = channel_count;
		return this;
	}

	getValuesForParameters() {
		return {
			channel_count: this.getChannelCount()
		};
	}

	setValuesFromParameters(parameters) {
		this.setChannelCount(parameters.get('channel_count'));
	}

}

extend(Message_Reply_LUserChannels.prototype, {

	reply:         Enum_Replies.RPL_LUSERCHANNELS,
	abnf:          '<channel-count> " :channels formed"',
	channel_count: null

});

module.exports = Message_Reply_LUserChannels;
