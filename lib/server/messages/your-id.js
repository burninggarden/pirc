var req = require('req');

var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ReplyNumerics = req('/constants/reply-numerics');

class ServerYourIdMessage extends ServerMessage {

	setMessageParts(message_parts) {
		console.log('in yourid message:');
		console.log(message_parts);
	}

}

extend(ServerYourIdMessage.prototype, {

	reply_numeric: ReplyNumerics.RPL_YOURID

});

module.exports = ServerYourIdMessage;
