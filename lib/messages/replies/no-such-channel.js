
var
	extend       = req('/lib/utilities/extend'),
	ReplyMessage = req('/lib/messages/reply'),
	Replies      = req('/lib/constants/replies'),
	ErrorReasons = req('/lib/constants/error-reasons');

var
	InvalidChannelNameError = req('/lib/errors/invalid-channel-name');


class NoSuchChannelMessage extends ReplyMessage {

	getValuesForParameters() {
		return {
			channel_name: this.getChannelName()
		};
	}

	setValuesFromParameters(parameters) {
		this.setChannelName(parameters.get('channel_name'));
	}

	toError() {
		return new InvalidChannelNameError(
			this.getChannelName(),
			ErrorReasons.NOT_FOUND
		);
	}

}

extend(NoSuchChannelMessage.prototype, {
	reply: Replies.ERR_NOSUCHCHANNEL,
	abnf:  '<channel-name> " :No such channel"'
});

module.exports = NoSuchChannelMessage;
