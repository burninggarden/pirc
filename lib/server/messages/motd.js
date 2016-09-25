var req = require('req');

var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ReplyNumerics = req('/constants/reply-numerics');

class ServerMotdMessage extends ServerMessage {

	setMessageParts(message_parts) {
		console.log('in motd message:');
		console.log(message_parts);
	}

}

extend(ServerMotdMessage.prototype, {

	reply_numeric: ReplyNumerics.RPL_MOTD

});

module.exports = ServerMotdMessage;
