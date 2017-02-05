var req = require('req');

var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ReplyNumerics = req('/constants/reply-numerics');

class ServerCreatedMessage extends ServerMessage {

	setMessageParts(message_parts) {
		console.log('in created message:');
		console.log(message_parts);
		throw new Error('implement');
	}

}

extend(ServerCreatedMessage.prototype, {

	reply_numeric: ReplyNumerics.RPL_CREATED

});

module.exports = ServerCreatedMessage;
