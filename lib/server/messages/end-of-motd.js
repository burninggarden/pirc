var req = require('req');

var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ReplyNumerics = req('/constants/reply-numerics');

class ServerEndOfMotdMessage extends ServerMessage {

	setMessageParts(message_parts) {
		console.log('in endofmotd message:');
		console.log(message_parts);
	}

}

extend(ServerEndOfMotdMessage.prototype, {

	reply_numeric: ReplyNumerics.RPL_ENDOFMOTD

});

module.exports = ServerEndOfMotdMessage;
