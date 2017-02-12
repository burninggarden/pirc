var req = require('req');

var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ReplyNumerics = req('/constants/reply-numerics');

class ServerWhoisUserMessage extends ServerMessage {

	applyParsedParams(middle_params, trailing_param) {
		var user_details = this.getUserDetails();

		user_details.setNick(middle_params[0]);
		user_details.setUsername(middle_params[1]);
		user_details.setHostname(middle_params[2]);

		user_details.setRealname(trailing_param);
	}

}

extend(ServerWhoisUserMessage.prototype, {

	reply_numeric: ReplyNumerics.RPL_WHOISUSER

});

module.exports = ServerWhoisUserMessage;
