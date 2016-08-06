var req = require('req');

var
	extend         = req('/utilities/extend'),
	ClientMessage  = req('/lib/client/message'),
	Commands       = req('/constants/commands'),
	StructureItems = req('/constants/structure-items');


class ClientPongMessage extends ClientMessage {

}

extend(ClientPongMessage.prototype, {
	structure_definition: [
		StructureItems.COMMAND,
		StructureItems.SERVER_NAME
	],
	command:              Commands.PONG
});

module.exports = ClientPongMessage;
