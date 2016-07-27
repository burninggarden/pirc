
var req = require('req');

var
	extend         = req('/utilities/extend'),
	ServerMessage  = req('/lib/server/message'),
	NumericReplies = req('/constants/numeric-replies');

class ServerGlobalUsersMessage extends ServerMessage {

	setMessageParts(message_parts) {
	}

}

extend(ServerGlobalUsersMessage.prototype, {

	numeric_reply: NumericReplies.RPL_GLOBALUSERS

});

module.exports = ServerGlobalUsersMessage;
