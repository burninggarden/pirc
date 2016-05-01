var req = require('req');

var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ResponseTypes = req('/constants/response-types');

class ServerEndOfMotdMessage extends ServerMessage {

	setMessageParts(message_parts) {
		console.log('in endofmotd message:');
		console.log(message_parts);
	}

}

extend(ServerEndOfMotdMessage.prototype, {

	response_type: ResponseTypes.ENDOFMOTD

});

module.exports = ServerEndOfMotdMessage;
