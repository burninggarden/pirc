
var
	extend       = req('/lib/utilities/extend'),
	ReplyMessage = req('/lib/messages/reply'),
	Replies      = req('/lib/constants/replies');

class EndOfWhoisMessage extends ReplyMessage {

	applyParsedParameters(middle_parameters, trailing_parameter) {
		this.addTargetFromString(middle_parameters[0]);
		this.getTargetUserDetails().setNick(middle_parameters[1]);
		this.setBody(trailing_parameter);
	}

	serializeParameters() {
		var
			targets = this.serializeTargets(),
			nick    = this.getUserDetails().getNick(),
			body    = this.getBody();

		return `${targets} ${nick} :${body}`;
	}

}

extend(EndOfWhoisMessage.prototype, {

	reply: Replies.RPL_ENDOFWHOIS,
	body:  'End of /WHOIS list.'

});

module.exports = EndOfWhoisMessage;
