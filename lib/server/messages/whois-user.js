var req = require('req');

var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ReplyNumerics = req('/constants/reply-numerics'),
	UserDetails   = req('/lib/user-details');

class ServerWhoisUserMessage extends ServerMessage {

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
			username     = user_details.getUsername(),
			hostname     = user_details.getHostname(),
			realname     = user_details.getRealname();

		return `${targets} ${nick} ${username} ${hostname} * :${realname}`;
	}

	applyParsedParams(middle_params, trailing_param) {
		if (middle_params.length !== 5) {
			throw new Error('Invalid message: ' + this.raw_message);
		}

		this.addTargetFromString(middle_params[0]);

		var user_details = this.getTargetUserDetails();

		user_details.setNick(middle_params[1]);
		user_details.setUsername(middle_params[2]);
		user_details.setHostname(middle_params[3]);

		// NOTE: There is also a trailing asterisk "*" parameter,
		// but it is ignored.

		user_details.setRealname(trailing_param);

		this.setTargetUserDetails(user_details);
	}

}

extend(ServerWhoisUserMessage.prototype, {

	reply_numeric:       ReplyNumerics.RPL_WHOISUSER,
	target_user_details: null

});

module.exports = ServerWhoisUserMessage;
