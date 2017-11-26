
var
	extend        = require('../../utility/extend'),
	Message_Reply = require('../../message/reply'),
	Enum_Replies  = require('../../enum/replies');


class Message_Reply_BannedFromChannel extends Message_Reply {

	getValuesForParameters() {
		return {
			channel_name: this.getChannelName()
		};
	}

	setValuesFromParameters(parameters) {
		this.setChannelName(parameters.get('channel_name'));
	}

}

extend(Message_Reply_BannedFromChannel.prototype, {
	reply:        Enum_Replies.ERR_BANNEDFROMCHAN,
	abnf:         '<channel-name> " :Cannot join channel (+b)"',
	channel_name: null
});

module.exports = Message_Reply_BannedFromChannel;
