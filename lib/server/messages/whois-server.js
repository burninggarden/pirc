
var
	extend        = req('/lib/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ReplyNumerics = req('/lib/constants/reply-numerics'),
	UserDetails   = req('/lib/user-details');

class ServerWhoisServerMessage extends ServerMessage {

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
			hostname     = user_details.getServerHostname(),
			server_name  = user_details.getServerName();

		return `${targets} ${nick} ${hostname} :${server_name}`;
	}

	applyParsedParams(middle_params, trailing_param) {
		this.addTargetFromString(middle_params[0]);

		var user_details = this.getTargetUserDetails();

		user_details.setNick(middle_params[1]);
		user_details.setServerHostname(middle_params[2]);

		this.setBody(trailing_param);
	}

}

extend(ServerWhoisServerMessage.prototype, {

	reply_numeric:       ReplyNumerics.RPL_WHOISSERVER,
	target_user_details: null

});

module.exports = ServerWhoisServerMessage;
