var
	extendClass             = req('/utilities/extend-class'),
	ServerMessage           = req('/lib/server/message'),
	PrivateMessageInterface = req('/lib/interfaces/messages/private');


class ServerPrivateMessage extends ServerMessage {

}

extendClass(ServerPrivateMessage).withInterface(PrivateMessageInterface);

module.exports = ServerPrivateMessage;
