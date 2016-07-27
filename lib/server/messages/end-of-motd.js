var req = require('req');

var
	extend         = req('/utilities/extend'),
	ServerMessage  = req('/lib/server/message'),
	NumericReplies = req('/constants/numeric-replies');

class ServerEndOfMotdMessage extends ServerMessage {

	setMessageParts(message_parts) {
		console.log('in endofmotd message:');
		console.log(message_parts);
	}

}

extend(ServerEndOfMotdMessage.prototype, {

	numeric_reply: NumericReplies.RPL_ENDOFMOTD

});

module.exports = ServerEndOfMotdMessage;
