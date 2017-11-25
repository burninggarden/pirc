
var
	extend        = req('/lib/utility/extend'),
	Message_Reply = req('/lib/message/reply'),
	Enum_Replies  = req('/lib/enum/replies');


class Message_Reply_NoChannelModes extends Message_Reply {

	getValuesForParameters() {
		return {
			channel_name: this.getChannelName()
		};
	}

	setValuesFromParameters(parameters) {
		this.setChannelName(parameters.get('channel_name'));
	}


}

extend(Message_Reply_NoChannelModes.prototype, {
	reply: Enum_Replies.ERR_NOCHANMODES,
	abnf:  '<channel-name> " :Channel doesn\'t support modes"'
});

module.exports = Message_Reply_NoChannelModes;
