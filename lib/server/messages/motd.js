var req = require('req');

var
	extend         = req('/utilities/extend'),
	ServerMessage  = req('/lib/server/message'),
	NumericReplies = req('/constants/numeric-replies');

class ServerMotdMessage extends ServerMessage {

	setMessageParts(message_parts) {
		console.log('in motd message:');
		console.log(message_parts);
	}

}

extend(ServerMotdMessage.prototype, {

	numeric_reply: NumericReplies.RPL_MOTD

});

module.exports = ServerMotdMessage;
