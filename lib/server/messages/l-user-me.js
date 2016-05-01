var req = require('req');

var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ResponseTypes = req('/constants/response-types');

class ServerLUserMeMessage extends ServerMessage {

	setMessageParts(message_parts) {
		console.log('in luserme message:');
		console.log(message_parts);
	}

}

extend(ServerLUserMeMessage.prototype, {

	response_type: ResponseTypes.LUSERME

});

module.exports = ServerLUserMeMessage;
