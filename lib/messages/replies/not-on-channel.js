
var
	extend            = req('/lib/utilities/extend'),
	ReplyMessage      = req('/lib/messages/reply'),
	ReplyNumerics     = req('/lib/constants/reply-numerics'),
	NotOnChannelError = req('/lib/errors/not-on-channel');


class NotOnChannelMessage extends ReplyMessage {

	serializeParameters() {
		var
			targets         = this.serializeTargets(),
			channel_details = this.getChannelDetails(),
			channel_name    = channel_details.getName(),
			body            = this.getBody();

		return `${targets} ${channel_name} :${body}`;
	}

	applyParsedParameters(middle_parameters, trailing_parameter) {
		this.addTargetFromString(middle_parameters.shift());

		this.getChannelDetails().setName(middle_parameters.shift());
		this.setBody(trailing_parameter);
	}

	toError() {
		var channel_name = this.getChannelDetails().getName();

		return new NotOnChannelError(channel_name);
	}

}

extend(NotOnChannelMessage.prototype, {
	reply_numeric: ReplyNumerics.ERR_NOTONCHANNEL,
	body:          'You are not on the specified channel'
});

module.exports = NotOnChannelMessage;
