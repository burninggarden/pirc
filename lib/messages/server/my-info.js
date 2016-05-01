var req = require('req');

var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/messages/server'),
	ResponseTypes = req('/constants/response-types');

class ServerMyInfoMessage extends ServerMessage {

	setMessageParts(message_parts) {
		console.log('in myinfo message:');
		console.log(message_parts);
	}

}

extend(ServerMyInfoMessage.prototype, {

	response_type: ResponseTypes.MYINFO

});

module.exports = ServerMyInfoMessage;
