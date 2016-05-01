var req = require('req');

var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ResponseTypes = req('/constants/response-types');

class ServerCreatedMessage extends ServerMessage {

	setMessageParts(message_parts) {
		console.log('in created message:');
		console.log(message_parts);
	}

}

extend(ServerCreatedMessage.prototype, {

	response_type: ResponseTypes.CREATED

});

module.exports = ServerCreatedMessage;
