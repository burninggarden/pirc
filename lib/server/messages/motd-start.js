var req = require('req');

var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ResponseTypes = req('/constants/response-types');

class ServerMotdStartMessage extends ServerMessage {

	setMessageParts(message_parts) {
		console.log('in motdstart message:');
		console.log(message_parts);
	}

}

extend(ServerMotdStartMessage.prototype, {

	response_type: ResponseTypes.MOTDSTART

});

module.exports = ServerMotdStartMessage;
