
var
	extend       = req('/lib/utilities/extend'),
	ReplyMessage = req('/lib/messages/reply'),
	Replies      = req('/lib/constants/replies');


class ChannelIsFullMessage extends ReplyMessage {

	getValuesForParameters() {
		return {
			channel_name: this.getChannelName()
		};
	}

	setValuesFromParameters(parameters) {
		this.setChannelName(parameters.get('channel_name'));
	}

}

extend(ChannelIsFullMessage.prototype, {
	reply: Replies.ERR_CHANNELISFULL,
	abnf:  '<channel-name> " :Cannot join channel (+l)"'
});

module.exports = ChannelIsFullMessage;
