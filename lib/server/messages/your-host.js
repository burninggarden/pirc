var req = require('req');

var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ResponseTypes = req('/constants/response-types');

class ServerYourHostMessage extends ServerMessage {

	setMessageParts(message_parts) {
		console.log('in yourhost message:');
		console.log(message_parts);
	}

}

extend(ServerYourHostMessage.prototype, {

	response_type: ResponseTypes.YOURHOST

});

module.exports = ServerYourHostMessage;
