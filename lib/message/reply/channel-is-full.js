
var
	extend        = require('../../utility/extend'),
	Message_Reply = require('../../message/reply'),
	Enum_Replies  = require('../../enum/replies');


class Message_Reply_ChannelIsFull extends Message_Reply {

	getValuesForParameters() {
		return {
			channel_name: this.getChannelName()
		};
	}

	setValuesFromParameters(parameters) {
		this.setChannelName(parameters.get('channel_name'));
	}

}

extend(Message_Reply_ChannelIsFull.prototype, {
	reply: Enum_Replies.ERR_CHANNELISFULL,
	abnf:  '<channel-name> " :Cannot join channel (+l)"'
});

module.exports = Message_Reply_ChannelIsFull;
