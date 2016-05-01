var req = require('req');

var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ResponseTypes = req('/constants/response-types');

class ServerWelcomeMessage extends ServerMessage {

	setMessageParts(message_parts) {
		console.log('in welcome message:');
		console.log(message_parts);
	}

}

extend(ServerWelcomeMessage.prototype, {

	response_type: ResponseTypes.WELCOME

});

module.exports = ServerWelcomeMessage;
