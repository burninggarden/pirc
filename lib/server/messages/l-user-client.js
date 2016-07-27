var req = require('req');

var
	extend         = req('/utilities/extend'),
	ServerMessage  = req('/lib/server/message'),
	NumericReplies = req('/constants/numeric-replies');

class ServerLUserClientMessage extends ServerMessage {

	setMessageParts(message_parts) {
		console.log('in luserclient message:');
		console.log(message_parts);
	}

}

extend(ServerLUserClientMessage.prototype, {

	numeric_reply: NumericReplies.RPL_LUSERCLIENT

});

module.exports = ServerLUserClientMessage;
