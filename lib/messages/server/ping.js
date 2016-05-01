var req = require('req');

var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/messages/server'),
	Commands      = req('/constants/commands');



class ServerPingMessage extends ServerMessage {
}

extend(ServerPingMessage.prototype, {

	command: Commands.PING

});
