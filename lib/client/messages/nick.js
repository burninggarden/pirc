var req = require('req');

var
	extend         = req('/utilities/extend'),
	ClientMessage  = req('/lib/client/message'),
	Commands       = req('/constants/commands'),
	StructureItems = req('/constants/structure-items');

class ClientNickMessage extends ClientMessage {

}

extend(ClientNickMessage.prototype, {
	structure_definition: [StructureItems.COMMAND, StructureItems.NICK],
	command:              Commands.NICK
});

module.exports = ClientNickMessage;
