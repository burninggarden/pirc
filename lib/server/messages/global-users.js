
var req = require('req');

var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ResponseTypes = req('/constants/response-types');

class ServerGlobalUsersMessage extends ServerMessage {

	setMessageParts(message_parts) {
	}

}

extend(ServerGlobalUsersMessage.prototype, {

	response_type: ResponseTypes.GLOBALUSERS

});

module.exports = ServerGlobalUsersMessage;
