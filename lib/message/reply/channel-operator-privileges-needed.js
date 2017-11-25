
var
	extend        = req('/lib/utility/extend'),
	Message_Reply = req('/lib/message/reply'),
	Enum_Replies  = req('/lib/enum/replies');


class Message_Reply_ChannelOperatorPrivilegesNeeded extends Message_Reply {

	getChannelName() {
		return this.channel_name;
	}

	setChannelName(channel_name) {
		this.channel_name = channel_name;
		return this;
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

extend(Message_Reply_ChannelOperatorPrivilegesNeeded.prototype, {

	reply:        Enum_Replies.ERR_CHANOPRIVSNEEDED,
	abnf:         '<channel-name> " :You\'re not channel operator"',
	channel_name: null

});

module.exports = Message_Reply_ChannelOperatorPrivilegesNeeded;
