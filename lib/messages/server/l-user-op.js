var req = require('req');

var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/messages/server'),
	ResponseTypes = req('/constants/response-types');

class ServerLUserOpMessage extends ServerMessage {

	setMessageParts(message_parts) {
		console.log('in luserop message:');
		console.log(message_parts);
	}

}

extend(ServerLUserOpMessage.prototype, {

	response_type: ResponseTypes.LUSEROP

});

module.exports = ServerLUserOpMessage;
