
var
	extend       = req('/lib/utilities/extend'),
	ReplyMessage = req('/lib/messages/reply'),
	Replies      = req('/lib/constants/replies');


class ChannelOperatorPrivilegesNeededMessage extends ReplyMessage {

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

extend(ChannelOperatorPrivilegesNeededMessage.prototype, {

	reply:        Replies.ERR_CHANOPRIVSNEEDED,
	abnf:         '<channel-name> " :You\'re not channel operator"',
	channel_name: null

});

module.exports = ChannelOperatorPrivilegesNeededMessage;