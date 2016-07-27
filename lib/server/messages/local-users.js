var req = require('req');

var
	extend         = req('/utilities/extend'),
	ServerMessage  = req('/lib/server/message'),
	NumericReplies = req('/constants/numeric-replies');

class ServerLocalUsersMessage extends ServerMessage {

	setMessageParts(message_parts) {
	}

}

extend(ServerLocalUsersMessage.prototype, {

	numeric_reply: NumericReplies.RPL_LOCALUSERS

});

module.exports = ServerLocalUsersMessage;
