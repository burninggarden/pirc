
var
	extend        = req('/lib/utilities/extend'),
	ReplyMessage  = req('/lib/messages/reply'),
	ReplyNumerics = req('/lib/constants/reply-numerics');


class WhoisServerMessage extends ReplyMessage {

	serializeParameters() {
		var
			targets      = this.serializeTargets(),
			user_details = this.getTargetUserDetails(),
			nick         = user_details.getNick(),
			body         = this.getBody();

		return `${targets} ${nick} :${body}`;
	}

	applyParsedParameters(middle_parameters, trailing_parameter) {
		this.addTargetFromString(middle_parameters[0]);

		var user_details = this.getTargetUserDetails();

		user_details.setNick(middle_parameters[1]);


		// NOTICE:
		// We can explicitly set "true" as the value here, because
		// if a message of this type was received, it means the client
		// is definitely using a secure connection (we would not have
		// received the message if at all if they weren't).
		user_details.setHasSecureConnection(true);

		this.setBody(trailing_parameter);
	}

}

extend(WhoisServerMessage.prototype, {

	reply_numeric: ReplyNumerics.RPL_WHOISSECURE,
	body:          ':is using a secure connection'

});

module.exports = WhoisServerMessage;
