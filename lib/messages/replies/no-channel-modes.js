
var
	extend        = req('/lib/utilities/extend'),
	ReplyMessage  = req('/lib/messages/reply'),
	ReplyNumerics = req('/lib/constants/reply-numerics');


class NoChannelModesMessage extends ReplyMessage {

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

extend(NoChannelModesMessage.prototype, {
	reply_numeric: ReplyNumerics.ERR_NOTCHANMODES,
	body:          'The specified channel does not support mode changes'
});

module.exports = NoChannelModesMessage;
