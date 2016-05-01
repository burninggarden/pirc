var req = require('req');

var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/messages/server'),
	Commands      = req('/constants/commands');


class ServerNoticeMessage extends ServerMessage {

	setMessageParts(message_parts) {
		console.log(message_parts);
	}

}

extend(ServerNoticeMessage.prototype, {

	command: Commands.NOTICE

});

module.exports = ServerNoticeMessage;
