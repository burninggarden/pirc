var req = require('req');

var
	extend         = req('/utilities/extend'),
	ServerMessage  = req('/lib/server/message'),
	NumericReplies = req('/constants/numeric-replies');

class ServerWelcomeMessage extends ServerMessage {

	setMessageParts(message_parts) {
		console.log('in welcome message:');
		console.log(message_parts);
	}

}

extend(ServerWelcomeMessage.prototype, {

	numeric_reply: NumericReplies.RPL_WELCOME

});

module.exports = ServerWelcomeMessage;
