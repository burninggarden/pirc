
var
	extend         = req('/lib/utilities/extend'),
	ServerMessage  = req('/lib/server/message'),
	Commands       = req('/lib/constants/commands'),
	ChannelDetails = req('/lib/channel-details');


class ServerPartMessage extends ServerMessage {

	isFromServer() {
		return false;
	}

	serializeParameters() {
		return this.getChannelDetails().getName();
	}

	applyParsedParameters(middle_parameters, trailing_parameter) {
		var
			channel_name    = middle_parameters[0],
			channel_details = ChannelDetails.fromName(channel_name);

		this.setChannelDetails(channel_details);

		// If the user didn't specify a parting message,
		// the trailing parameter will be undefined.
		if (trailing_parameter) {
			this.setBody(trailing_parameter);
		}
	}

}

extend(ServerPartMessage.prototype, {
	command: Commands.PART

});

module.exports = ServerPartMessage;
