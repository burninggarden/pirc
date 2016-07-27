var req = require('req');

var
	extend         = req('/utilities/extend'),
	ServerMessage  = req('/lib/server/message'),
	NumericReplies = req('/constants/numeric-replies');

class ServerMotdStartMessage extends ServerMessage {

	setMessageParts(message_parts) {
		console.log('in motdstart message:');
		console.log(message_parts);
	}

}

extend(ServerMotdStartMessage.prototype, {

	numeric_reply: NumericReplies.RPL_MOTDSTART

});

module.exports = ServerMotdStartMessage;
