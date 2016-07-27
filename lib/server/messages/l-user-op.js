var req = require('req');

var
	extend         = req('/utilities/extend'),
	ServerMessage  = req('/lib/server/message'),
	NumericReplies = req('/constants/numeric-replies');

class ServerLUserOpMessage extends ServerMessage {

	setMessageParts(message_parts) {
		console.log('in luserop message:');
		console.log(message_parts);
	}

}

extend(ServerLUserOpMessage.prototype, {

	numeric_reply: NumericReplies.RPL_LUSEROP

});

module.exports = ServerLUserOpMessage;
