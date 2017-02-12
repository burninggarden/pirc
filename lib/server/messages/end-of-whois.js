var req = require('req');

var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ReplyNumerics = req('/constants/reply-numerics'),
	UserDetails   = req('/lib/user-details');

class ServerEndOfWhoisMessage extends ServerMessage {

	setTargetUserDetails(user_details) {
		this.target_user_details = user_details;
	}

	getTargetUserDetails() {
		if (!this.target_user_details) {
			this.target_user_details = new UserDetails();
		}

		return this.target_user_details;
	}

	applyParsedParams(middle_params, trailing_param) {
		this.getTargetUserDetails().setNick(middle_params[0]);
		this.setBody(trailing_param);
	}

	serializeParams() {
		var
			nick = this.getUserDetails().getNick(),
			body = this.getBody();

		return `${nick} :${body}`;
	}

}

extend(ServerEndOfWhoisMessage.prototype, {

	reply_numeric: ReplyNumerics.RPL_ENDOFWHOIS,
	body:          'End of WHOIS list'

});

module.exports = ServerEndOfWhoisMessage;
