var req = require('req');

var
	extend         = req('/utilities/extend'),
	ServerMessage  = req('/lib/server/message'),
	NumericReplies = req('/constants/numeric-replies');

class ServerLUserChannelsMessage extends ServerMessage {

	setMessageParts(message_parts) {
		console.log('in luserchannels message:');
		console.log(message_parts);
	}

}

extend(ServerLUserChannelsMessage.prototype, {

	numeric_reply: NumericReplies.RPL_LUSERCHANNELS

});

module.exports = ServerLUserChannelsMessage;
