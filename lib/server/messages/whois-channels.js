var req = require('req');

var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ReplyNumerics = req('/constants/reply-numerics'),
	UserDetails   = req('/lib/user-details');

class ServerWhoisChannelsMessage extends ServerMessage {

	setTargetUserDetails(user_details) {
		this.target_user_details = user_details;
	}

	getTargetUserDetails() {
		if (!this.target_user_details) {
			this.target_user_details = new UserDetails();
		}

		return this.target_user_details;
	}

	getChannelNames() {
		return this.getTargetUserDetails().getChannelNamesWithPrefixes();
	}

	applyParsedParams(middle_params, trailing_param) {
		var user_details = this.getTargetUserDetails();

		user_details.setNick(middle_params[0]);
		user_details.setChannelNames(trailing_param.split(' '));
	}

	serializeParams() {
		var
			nick = this.getTargetUserDetails().getNick(),
			body = this.getBody();

		return `${nick} :${body}`;
	}

}

extend(ServerWhoisChannelsMessage.prototype, {

	reply_numeric:       ReplyNumerics.RPL_WHOISCHANNELS,
	target_user_details: null

});

module.exports = ServerWhoisChannelsMessage;
