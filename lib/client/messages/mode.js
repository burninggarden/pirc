
var
	extendClass = req('/utilities/extend-class');

var
	ClientMessage = req('/lib/client/message'),
	ModeInterface = req('/lib/interfaces/messages/mode');


class ClientModeMessage extends ClientMessage {

}

extendClass(ClientModeMessage).withInterface(ModeInterface);

module.exports = ClientModeMessage;
