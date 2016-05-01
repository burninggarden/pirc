var req = require('req');

var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/messages/server'),
	ResponseTypes = req('/constants/response-types');

class ServerBounceMessage extends ServerMessage {

	setMessageParts(message_parts) {
		console.log('in bounce message:');
		console.log(message_parts);
	}

}

extend(ServerBounceMessage.prototype, {

	response_type: ResponseTypes.BOUNCE

});

module.exports = ServerBounceMessage;
