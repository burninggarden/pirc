var req = require('req');

var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ReplyNumerics = req('/constants/reply-numerics');

class ServerMotdStartMessage extends ServerMessage {

	setMessageParts(message_parts) {
		console.log('in motdstart message:');
		console.log(message_parts);
	}

}

extend(ServerMotdStartMessage.prototype, {

	reply_numeric: ReplyNumerics.RPL_MOTDSTART

});

module.exports = ServerMotdStartMessage;
