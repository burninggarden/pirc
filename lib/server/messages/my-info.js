var req = require('req');

var
	extend         = req('/utilities/extend'),
	ServerMessage  = req('/lib/server/message'),
	NumericReplies = req('/constants/numeric-replies');

class ServerMyInfoMessage extends ServerMessage {

	setMessageParts(message_parts) {
		console.log('in myinfo message:');
		console.log(message_parts);
	}

}

extend(ServerMyInfoMessage.prototype, {

	numeric_reply: NumericReplies.RPL_MYINFO

});

module.exports = ServerMyInfoMessage;
