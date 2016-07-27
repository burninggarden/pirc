var req = require('req');

var
	extend         = req('/utilities/extend'),
	ServerMessage  = req('/lib/server/message'),
	NumericReplies = req('/constants/numeric-replies');

class ServerCreatedMessage extends ServerMessage {

	setMessageParts(message_parts) {
		console.log('in created message:');
		console.log(message_parts);
	}

}

extend(ServerCreatedMessage.prototype, {

	numeric_reply: NumericReplies.RPL_CREATED

});

module.exports = ServerCreatedMessage;
