var
	extend         = req('/utilities/extend'),
	ServerMessage  = req('/lib/server/message'),
	NumericReplies = req('/constants/numeric-replies'),
	StructureItems = req('/constants/structure-items');


class ServerWelcomeMessage extends ServerMessage {

}


extend(ServerWelcomeMessage.prototype, {

	structure_definition: [
		StructureItems.SERVER_NAME,
		StructureItems.NUMERIC_REPLY,
		StructureItems.NICK,
		StructureItems.BODY
	],

	numeric_reply: NumericReplies.RPL_WELCOME

});

module.exports = ServerWelcomeMessage;
