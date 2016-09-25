var req = require('req');

var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ReplyNumerics = req('/constants/reply-numerics');

class ServerLocalUsersMessage extends ServerMessage {

	setMessageParts(message_parts) {
	}

}

extend(ServerLocalUsersMessage.prototype, {

	reply_numeric: ReplyNumerics.RPL_LOCALUSERS

});

module.exports = ServerLocalUsersMessage;
