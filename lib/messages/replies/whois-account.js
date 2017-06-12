
var
	extend        = req('/lib/utilities/extend'),
	ReplyMessage  = req('/lib/messages/reply'),
	ReplyNumerics = req('/lib/constants/reply-numerics');


class WhoisAccountMessage extends ReplyMessage {

	serializeParameters() {
		var
			targets      = this.serializeTargets(),
			user_details = this.getTargetUserDetails(),
			nick         = user_details.getNick(),
			authname     = user_details.getAuthname(),
			body         = this.getBody();

		return `${targets} ${nick} ${authname} :${body}`;
	}

	applyParsedParameters(middle_parameters, trailing_parameter) {
		this.addTargetFromString(middle_parameters[0]);

		var user_details = this.getTargetUserDetails();

		user_details.setNick(middle_parameters[1]);
		user_details.setAuthname(middle_parameters[2]);

		this.setBody(trailing_parameter);
	}

}

extend(WhoisAccountMessage.prototype, {

	reply_numeric: ReplyNumerics.RPL_WHOISACCOUNT,
	body:          ':is logged in as'

});

module.exports = WhoisAccountMessage;
