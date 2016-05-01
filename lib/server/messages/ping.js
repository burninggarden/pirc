var req = require('req');

var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	Commands      = req('/constants/commands');



class ServerPingMessage extends ServerMessage {
}

extend(ServerPingMessage.prototype, {

	command: Commands.PING

});
