var req = require('req');

var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ReplyNumerics = req('/constants/reply-numerics');

class ServerLUserChannelsMessage extends ServerMessage {

	setMessageParts(message_parts) {
		console.log('in luserchannels message:');
		console.log(message_parts);
	}

}

extend(ServerLUserChannelsMessage.prototype, {

	reply_numeric: ReplyNumerics.RPL_LUSERCHANNELS

});

module.exports = ServerLUserChannelsMessage;
