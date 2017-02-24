
var
	extendClass = req('/utilities/extend-class');

var
	ServerMessage = req('/lib/server/message'),
	ModeInterface = req('/lib/interfaces/messages/mode');


class ServerModeMessage extends ServerMessage {

}

extendClass(ServerModeMessage).withInterface(ModeInterface);


module.exports = ServerModeMessage;
