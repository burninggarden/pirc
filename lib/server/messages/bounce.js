var req = require('req');

var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ReplyNumerics = req('/constants/reply-numerics');

class ServerBounceMessage extends ServerMessage {

	setMessageParts(message_parts) {
		console.log('in bounce message:');
		console.log(message_parts);
	}

}

extend(ServerBounceMessage.prototype, {

	reply_numeric: ReplyNumerics.RPL_BOUNCE

});

module.exports = ServerBounceMessage;
