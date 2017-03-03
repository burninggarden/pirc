
var
	extend         = req('/utilities/extend'),
	ServerMessage  = req('/lib/server/message'),
	Commands       = req('/constants/commands'),
	ChannelDetails = req('/lib/channel-details');


class ServerPartMessage extends ServerMessage {

	isFromServer() {
		return false;
	}

	serializeParams() {
		return this.getChannelDetails().getName();
	}

	applyParsedParams(middle_params, trailing_param) {
		var
			channel_name    = middle_params[0],
			channel_details = ChannelDetails.fromName(channel_name);

		this.setChannelDetails(channel_details);

		// If the user didn't specify a parting message,
		// the trailing parameter will be undefined.
		if (trailing_param) {
			this.setBody(trailing_param);
		}
	}

}

extend(ServerPartMessage.prototype, {
	command: Commands.PART

});

module.exports = ServerPartMessage;
