
var
	extend         = req('/lib/utilities/extend'),
	ServerMessage  = req('/lib/server/message'),
	Commands       = req('/lib/constants/commands'),
	ChannelDetails = req('/lib/channel-details');


class ServerJoinMessage extends ServerMessage {

	isFromServer() {
		return false;
	}

	serializeParameters() {
		return this.getChannelDetails().getName();
	}

	applyParsedParameters(middle_parameters, trailing_parameter) {
		if (middle_parameters.length === 0 && trailing_parameter !== null)  {
			middle_parameters.push(trailing_parameter);
		}

		var
			channel_name    = middle_parameters.shift(),
			channel_details = ChannelDetails.fromName(channel_name);

		this.setChannelDetails(channel_details);
	}

}

extend(ServerJoinMessage.prototype, {
	command: Commands.JOIN

});

module.exports = ServerJoinMessage;
