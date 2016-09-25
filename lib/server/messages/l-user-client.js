var req = require('req');

var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ReplyNumerics = req('/constants/reply-numerics');

class ServerLUserClientMessage extends ServerMessage {

	setMessageParts(message_parts) {
		console.log('in luserclient message:');
		console.log(message_parts);
	}

}

extend(ServerLUserClientMessage.prototype, {

	reply_numeric: ReplyNumerics.RPL_LUSERCLIENT

});

module.exports = ServerLUserClientMessage;
