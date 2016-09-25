
var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	Commands      = req('/constants/commands');


class ServerJoinMessage extends ServerMessage {

}

extend(ServerJoinMessage.prototype, {
	command: Commands.JOIN

});

module.exports = ServerJoinMessage;
