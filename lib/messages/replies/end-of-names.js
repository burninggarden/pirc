
var
	extend       = req('/lib/utilities/extend'),
	ReplyMessage = req('/lib/messages/reply'),
	Replies      = req('/lib/constants/replies');

class EndOfNamesMessage extends ReplyMessage {

	serializeParameters() {
		var
			targets      = this.serializeTargets(),
			channel_name = this.getChannelDetails().getName(),
			body         = this.getBody();

		return `${targets} ${channel_name} :${body}`;
	}

	applyParsedParameters(middle_parameters, trailing_parameter) {
		// The last middle parameter is the channel name in question:
		this.getChannelDetails().setName(middle_parameters.pop());
		// The remaining middle parameters are the message targets
		// (this will usually be an array with the only element being the
		//  nick of the current client):
		this.setTargetStrings(middle_parameters);
		this.setBody(trailing_parameter);
	}

}

extend(EndOfNamesMessage.prototype, {

	reply: Replies.RPL_ENDOFNAMES,
	body:  'End of /NAMES list.'

});

module.exports = EndOfNamesMessage;
