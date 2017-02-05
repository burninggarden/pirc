
var
	extend         = req('/utilities/extend'),
	ServerMessage  = req('/lib/server/message'),
	Commands       = req('/constants/commands'),
	ChannelDetails = req('/lib/channel-details');


class ServerPartMessage extends ServerMessage {

	isFromServer() {
		return false;
	}

	isFromClient() {
		return true;
	}

	serializeParams() {
		return this.getChannelDetails().getName();
	}

	applyParsedParams(middle_params, trailing_param) {
		if (trailing_param !== null)  {
			throw new Error('Invalid trailing param: ' + trailing_param);
		}

		var
			channel_name    = middle_params[0],
			channel_details = ChannelDetails.fromName(channel_name);

		this.setChannelDetails(channel_details);
	}

}

extend(ServerPartMessage.prototype, {
	command: Commands.PART

});

module.exports = ServerPartMessage;
