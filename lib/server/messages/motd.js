var req = require('req');

var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ResponseTypes = req('/constants/response-types');

class ServerMotdMessage extends ServerMessage {

	setMessageParts(message_parts) {
		console.log('in motd message:');
		console.log(message_parts);
	}

}

extend(ServerMotdMessage.prototype, {

	response_type: ResponseTypes.MOTD

});

module.exports = ServerMotdMessage;
