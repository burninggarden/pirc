var req = require('req');

var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ReplyNumerics = req('/constants/reply-numerics');

class ServerYourHostMessage extends ServerMessage {

	setMessageParts(message_parts) {
		console.log('in yourhost message:');
		console.log(message_parts);
	}

}

extend(ServerYourHostMessage.prototype, {

	reply_numeric: ReplyNumerics.RPL_YOURHOST

});

module.exports = ServerYourHostMessage;
