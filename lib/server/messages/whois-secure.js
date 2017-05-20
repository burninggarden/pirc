
var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ReplyNumerics = req('/lib/constants/reply-numerics');


class ServerWhoisServerMessage extends ServerMessage {

	serializeParams() {
		var
			targets      = this.serializeTargets(),
			user_details = this.getTargetUserDetails(),
			nick         = user_details.getNick(),
			body         = this.getBody();

		return `${targets} ${nick} :${body}`;
	}

	applyParsedParams(middle_params, trailing_param) {
		this.addTargetFromString(middle_params[0]);

		var user_details = this.getTargetUserDetails();

		user_details.setNick(middle_params[1]);


		// NOTICE:
		// We can explicitly set "true" as the value here, because
		// if a message of this type was received, it means the client
		// is definitely using a secure connection (we would not have
		// received the message if at all if they weren't).
		user_details.setHasSecureConnection(true);

		this.setBody(trailing_param);
	}

}

extend(ServerWhoisServerMessage.prototype, {

	reply_numeric: ReplyNumerics.RPL_WHOISSECURE,
	body:          ':is using a secure connection'

});

module.exports = ServerWhoisServerMessage;
