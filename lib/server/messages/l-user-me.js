var req = require('req');

var
	extend         = req('/utilities/extend'),
	ServerMessage  = req('/lib/server/message'),
	NumericReplies = req('/constants/numeric-replies');

class ServerLUserMeMessage extends ServerMessage {

	setMessageParts(message_parts) {
		console.log('in luserme message:');
		console.log(message_parts);
	}

}

extend(ServerLUserMeMessage.prototype, {

	numeric_reply: NumericReplies.RPL_LUSERME

});

module.exports = ServerLUserMeMessage;
