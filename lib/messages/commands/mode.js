
var
	extendClass = req('/lib/utilities/extend-class');

var
	CommandMessage = req('/lib/messages/command'),
	ModeInterface  = req('/lib/interfaces/messages/mode');


class ModeMessage extends CommandMessage {

}

extendClass(ModeMessage).withInterface(ModeInterface);

module.exports = ModeMessage;
