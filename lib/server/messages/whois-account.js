
var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ReplyNumerics = req('/constants/reply-numerics'),
	UserDetails   = req('/lib/user-details');


class ServerWhoisAccountMessage extends ServerMessage {

	setTargetUserDetails(user_details) {
		this.target_user_details = user_details;
	}

	getTargetUserDetails() {
		if (!this.target_user_details) {
			this.target_user_details = new UserDetails();
		}

		return this.target_user_details;
	}

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

	reply_numeric:       ReplyNumerics.RPL_WHOISACCOUNT,
	target_user_details: null,
	body:                ':is logged in as'

});

module.exports = ServerWhoisAccountMessage;
