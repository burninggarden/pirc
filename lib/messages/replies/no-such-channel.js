
var
	extend       = req('/lib/utilities/extend'),
	ReplyMessage = req('/lib/messages/reply'),
	Replies      = req('/lib/constants/replies'),
	ErrorReasons = req('/lib/constants/error-reasons');

var
	InvalidChannelNameError = req('/lib/errors/invalid-channel-name');


class NoSuchChannelMessage extends ReplyMessage {

	setChannelName(channel_name) {
		this.channel_name = channel_name;
		return this;
	}

	serializeParameters() {
		var
			targets      = this.serializeTargets(),
			channel_name = this.getChannelName(),
			body         = this.getBody();

		return `${targets} ${channel_name} :${body}`;
	}

	applyParsedParameters(middle_parameters, trailing_parameter) {
		this.addTargetFromString(middle_parameters.shift());
		this.setChannelName(middle_parameters.shift());
		this.setBody(trailing_parameter);
	}

	getChannelName() {
		return this.channel_name;
	}

	toError() {
		return new InvalidChannelNameError(
			this.getChannelName(),
			ErrorReasons.NOT_FOUND
		);
	}

}

extend(NoSuchChannelMessage.prototype, {
	reply:        Replies.ERR_NOSUCHCHANNEL,
	body:         'No such channel',
	channel_name: null
});

module.exports = NoSuchChannelMessage;
