
var req = require('req');

var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ReplyNumerics = req('/constants/reply-numerics');

class ServerGlobalUsersMessage extends ServerMessage {

	setMessageParts(message_parts) {
	}

}

extend(ServerGlobalUsersMessage.prototype, {

	reply_numeric: ReplyNumerics.RPL_GLOBALUSERS

});

module.exports = ServerGlobalUsersMessage;
