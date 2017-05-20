
var
	extend        = req('/lib/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ReplyNumerics = req('/lib/constants/reply-numerics');


class ServerWhoisAccountMessage extends ServerMessage {

	serializeParams() {
		var
			targets      = this.serializeTargets(),
			user_details = this.getTargetUserDetails(),
			nick         = user_details.getNick(),
			authname     = user_details.getAuthname(),
			body         = this.getBody();

		return `${targets} ${nick} ${authname} :${body}`;
	}

	applyParsedParams(middle_params, trailing_param) {
		this.addTargetFromString(middle_params[0]);

		var user_details = this.getTargetUserDetails();

		user_details.setNick(middle_params[1]);
		user_details.setAuthname(middle_params[2]);

		this.setBody(trailing_param);
	}

}

extend(ServerWhoisAccountMessage.prototype, {

	reply_numeric: ReplyNumerics.RPL_WHOISACCOUNT,
	body:          ':is logged in as'

});

module.exports = ServerWhoisAccountMessage;
