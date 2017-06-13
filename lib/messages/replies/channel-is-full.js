
var
	extend        = req('/lib/utilities/extend'),
	ReplyMessage  = req('/lib/messages/reply'),
	ReplyNumerics = req('/lib/constants/reply-numerics');


class ChannelIsFullMessage extends ReplyMessage {

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

}

extend(ChannelIsFullMessage.prototype, {
	reply_numeric: ReplyNumerics.ERR_CHANNELISFULL,
	body:          'The specified channel is full'
});

module.exports = ChannelIsFullMessage;