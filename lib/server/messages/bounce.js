var req = require('req');

var
	extend         = req('/utilities/extend'),
	ServerMessage  = req('/lib/server/message'),
	NumericReplies = req('/constants/numeric-replies');

class ServerBounceMessage extends ServerMessage {

	setMessageParts(message_parts) {
		console.log('in bounce message:');
		console.log(message_parts);
	}

}

extend(ServerBounceMessage.prototype, {

	numeric_reply: NumericReplies.RPL_BOUNCE

});

module.exports = ServerBounceMessage;
