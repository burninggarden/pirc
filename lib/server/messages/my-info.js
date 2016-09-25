var req = require('req');

var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ReplyNumerics = req('/constants/reply-numerics');

class ServerMyInfoMessage extends ServerMessage {

	setMessageParts(message_parts) {
		console.log('in myinfo message:');
		console.log(message_parts);
	}

}

extend(ServerMyInfoMessage.prototype, {

	reply_numeric: ReplyNumerics.RPL_MYINFO

});

module.exports = ServerMyInfoMessage;
