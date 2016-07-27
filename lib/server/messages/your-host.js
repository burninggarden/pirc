var req = require('req');

var
	extend         = req('/utilities/extend'),
	ServerMessage  = req('/lib/server/message'),
	NumericReplies = req('/constants/numeric-replies');

class ServerYourHostMessage extends ServerMessage {

	setMessageParts(message_parts) {
		console.log('in yourhost message:');
		console.log(message_parts);
	}

}

extend(ServerYourHostMessage.prototype, {

	numeric_reply: NumericReplies.RPL_YOURHOST

});

module.exports = ServerYourHostMessage;
