var req = require('req');

var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ResponseTypes = req('/constants/response-types');

class ServerLUserClientMessage extends ServerMessage {

	setMessageParts(message_parts) {
		console.log('in luserclient message:');
		console.log(message_parts);
	}

}

extend(ServerLUserClientMessage.prototype, {

	response_type: ResponseTypes.LUSERCLIENT

});

module.exports = ServerLUserClientMessage;
