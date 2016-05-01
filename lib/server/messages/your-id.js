var req = require('req');

var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ResponseTypes = req('/constants/response-types');

class ServerYourIdMessage extends ServerMessage {

	setMessageParts(message_parts) {
		console.log('in yourid message:');
		console.log(message_parts);
	}

}

extend(ServerYourIdMessage.prototype, {

	response_type: ResponseTypes.YOURID

});

module.exports = ServerYourIdMessage;
