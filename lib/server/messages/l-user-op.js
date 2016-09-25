var req = require('req');

var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ReplyNumerics = req('/constants/reply-numerics');

class ServerLUserOpMessage extends ServerMessage {

	setMessageParts(message_parts) {
		console.log('in luserop message:');
		console.log(message_parts);
	}

}

extend(ServerLUserOpMessage.prototype, {

	reply_numeric: ReplyNumerics.RPL_LUSEROP

});

module.exports = ServerLUserOpMessage;
