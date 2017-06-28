
var
	extend       = req('/lib/utilities/extend'),
	ReplyMessage = req('/lib/messages/reply'),
	Replies      = req('/lib/constants/replies');


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

	reply:        Replies.RPL_ENDOFNAMES,
	abnf:         '<channel-name> " :End of NAMES list"',
	channel_name: null

});

module.exports = EndOfNamesMessage;
