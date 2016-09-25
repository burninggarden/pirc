var req = require('req');

var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ReplyNumerics = req('/constants/reply-numerics');

class ServerLUserMeMessage extends ServerMessage {

	setMessageParts(message_parts) {
		console.log('in luserme message:');
		console.log(message_parts);
	}

}

extend(ServerLUserMeMessage.prototype, {

	reply_numeric: ReplyNumerics.RPL_LUSERME

});

module.exports = ServerLUserMeMessage;
