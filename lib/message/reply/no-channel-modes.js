
var
	extend       = req('/lib/utility/extend'),
	ReplyMessage = req('/lib/message/reply'),
	Enum_Replies = req('/lib/enum/replies');


class NoChannelModesMessage extends ReplyMessage {

	getValuesForParameters() {
		return {
			channel_name: this.getChannelName()
		};
	}

	setValuesFromParameters(parameters) {
		this.setChannelName(parameters.get('channel_name'));
	}


}

extend(NoChannelModesMessage.prototype, {
	reply: Enum_Replies.ERR_NOCHANMODES,
	abnf:  '<channel-name> " :Channel doesn\'t support modes"'
});

module.exports = NoChannelModesMessage;
