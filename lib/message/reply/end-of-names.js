
var
	extend       = req('/lib/utility/extend'),
	ReplyMessage = req('/lib/message/reply'),
	Enum_Replies = req('/lib/enum/replies');


class EndOfNamesMessage extends ReplyMessage {

	setChannelName(channel_name) {
		this.channel_name = channel_name;
		return this;
	}

	getChannelName() {
		return this.channel_name;
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

extend(EndOfNamesMessage.prototype, {

	reply:        Enum_Replies.RPL_ENDOFNAMES,
	abnf:         '<channel-name> " :End of NAMES list"',
	channel_name: null

});

module.exports = EndOfNamesMessage;
