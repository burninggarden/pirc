
var
	extend         = req('/utilities/extend'),
	ServerMessage  = req('/lib/server/message'),
	Commands       = req('/constants/commands'),
	StructureItems = req('/constants/structure-items');



class ServerJoinMessage extends ServerMessage {

}

extend(ServerJoinMessage.prototype, {
	structure_definition: [
		StructureItems.USER_IDENTIFIER,
		StructureItems.COMMAND,
		StructureItems.CHANNEL_NAME
	],
	command:              Commands.JOIN

});

module.exports = ServerJoinMessage;
