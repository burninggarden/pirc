var req = require('req');

var
	extend         = req('/utilities/extend'),
	ServerMessage  = req('/lib/server/message'),
	NumericReplies = req('/constants/numeric-replies');

class ServerYourIdMessage extends ServerMessage {

	setMessageParts(message_parts) {
		console.log('in yourid message:');
		console.log(message_parts);
	}

}

extend(ServerYourIdMessage.prototype, {

	numeric_reply: NumericReplies.RPL_YOURID

});

module.exports = ServerYourIdMessage;
