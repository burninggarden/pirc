
var
	extend         = req('/utilities/extend'),
	ServerMessage  = req('/lib/server/message'),
	Commands       = req('/constants/commands'),
	ChannelDetails = req('/lib/channel-details');


class ServerJoinMessage extends ServerMessage {

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
		if (middle_params.length === 0 && trailing_param !== null)  {
			middle_params.push(trailing_param);
		}

		var
			channel_name    = middle_params.shift(),
			channel_details = ChannelDetails.fromName(channel_name);

		this.setChannelDetails(channel_details);
	}

}

extend(ServerJoinMessage.prototype, {
	command: Commands.JOIN

});

module.exports = ServerJoinMessage;
