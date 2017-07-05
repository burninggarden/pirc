
var
	extend       = req('/lib/utilities/extend'),
	ReplyMessage = req('/lib/messages/reply'),
	Replies      = req('/lib/constants/replies');


class UnknownModeMessage extends ReplyMessage {

	setMode(mode) {
		this.mode = mode;
		return this;
	}

	getMode() {
		return this.mode;
	}

	setChannelName(channel_name) {
		this.channel_name = channel_name;
		return this;
	}

	getChannelName() {
		return this.channel_name;
	}

	getValuesForParameters() {
		return {
			mode_char:    this.getMode(),
			channel_name: this.getChannelName()
		};
	}

	setValuesFromParameters(parameters) {
		this.setMode(parameters.get('mode_char'));
		this.setChannelName(parameters.get('channel_name'));
	}

}

extend(UnknownModeMessage.prototype, {
	reply:        Replies.ERR_UNKNOWNMODE,
	abnf:         '<mode-char> " :is unknown mode char to me for " <channel-name>',
	mode:         null,
	channel_name: null
});

module.exports = UnknownModeMessage;
