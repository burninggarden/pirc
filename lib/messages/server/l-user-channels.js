var req = require('req');

var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/messages/server'),
	ResponseTypes = req('/constants/response-types');

class ServerLUserChannelsMessage extends ServerMessage {

	setMessageParts(message_parts) {
		console.log('in luserchannels message:');
		console.log(message_parts);
	}

}

extend(ServerLUserChannelsMessage.prototype, {

	response_type: ResponseTypes.LUSERCHANNELS

});

module.exports = ServerLUserChannelsMessage;
