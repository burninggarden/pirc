
var
	extend        = req('/lib/utilities/extend'),
	ReplyMessage  = req('/lib/messages/reply'),
	ReplyNumerics = req('/lib/constants/reply-numerics');


class WhoisChannelsMessage extends ReplyMessage {

	getChannelNames() {
		return this.getTargetUserDetails().getChannelNamesWithPrefixes();
	}

	applyParsedParameters(middle_parameters, trailing_parameter) {
		if (middle_parameters.length !== 2) {
			throw new Error('Invalid message: ' + this.raw_message);
		}

		this.addTargetFromString(middle_parameters[0]);

		var user_details = this.getTargetUserDetails();

		user_details.setNick(middle_parameters[1]);
		user_details.setChannelNames(trailing_parameter.trim().split(' '));
	}

	serializeParameters() {
		var
			targets = this.serializeTargets(),
			nick    = this.getTargetUserDetails().getNick(),
			body    = this.getBody();

		return `${targets} ${nick} :${body}`;
	}

}

extend(WhoisChannelsMessage.prototype, {

	reply_numeric: ReplyNumerics.RPL_WHOISCHANNELS

});

module.exports = WhoisChannelsMessage;
