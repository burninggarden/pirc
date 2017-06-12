
var
	extendClass             = req('/lib/utilities/extend-class'),
	CommandMessage          = req('/lib/client/message'),
	PrivateMessageInterface = req('/lib/interfaces/messages/private');


class PrivateMessage extends CommandMessage {

}

extendClass(PrivateMessage).withInterface(PrivateMessageInterface);

module.exports = PrivateMessage;
