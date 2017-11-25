
var
	extend       = req('/lib/utility/extend'),
	ReplyMessage = req('/lib/message/reply'),
	Enum_Replies = req('/lib/enum/replies');


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
	reply: Enum_Replies.ERR_CHANNELISFULL,
	abnf:  '<channel-name> " :Cannot join channel (+l)"'
});

module.exports = ChannelIsFullMessage;
