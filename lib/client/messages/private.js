
var
	extendClass             = req('/utilities/extend-class'),
	ClientMessage           = req('/lib/client/message'),
	PrivateMessageInterface = req('/lib/interfaces/messages/private');


class ClientPrivateMessage extends ClientMessage {

}

extendClass(ClientPrivateMessage).withInterface(PrivateMessageInterface);

module.exports = ClientPrivateMessage;
