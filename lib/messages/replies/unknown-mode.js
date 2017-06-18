
var
	extend           = req('/lib/utilities/extend'),
	ReplyMessage     = req('/lib/messages/reply'),
	Replies          = req('/lib/constants/replies'),
	InvalidModeError = req('/lib/errors/invalid-mode'),
	ErrorReasons     = req('/lib/constants/error-reasons');


class UnknownModeMessage extends ReplyMessage {

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

	toError() {
		return new InvalidModeError(
			this.getMode(),
			ErrorReasons.UNKNOWN_TYPE
		);
	}

}

extend(UnknownModeMessage.prototype, {
	reply: Replies.ERR_UNKNOWNMODE
});

module.exports = UnknownModeMessage;
