var req = require('req');

var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ResponseTypes = req('/constants/response-types');

class ServerLocalUsersMessage extends ServerMessage {

	setMessageParts(message_parts) {
	}

}

extend(ServerLocalUsersMessage.prototype, {

	response_type: ResponseTypes.LOCALUSERS

});

module.exports = ServerLocalUsersMessage;
