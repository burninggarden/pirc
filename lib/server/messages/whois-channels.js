var req = require('req');

var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ReplyNumerics = req('/constants/reply-numerics');

class ServerWhoisChannelsMessage extends ServerMessage {

	getChannelNames() {
		return this.getUserDetails().getChannelNamesWithPrefixes();
	}

	applyParsedParams(middle_params, trailing_param) {
		var user_details = this.getUserDetails();

		user_details.setNick(middle_params[0]);
		user_details.setChannelNames(trailing_param.split(' '));
	}

}

extend(ServerWhoisChannelsMessage.prototype, {

	reply_numeric: ReplyNumerics.RPL_WHOISCHANNELS

});

module.exports = ServerWhoisChannelsMessage;
