var req = require('req');

var
	extend         = req('/utilities/extend'),
	ServerMessage  = req('/lib/server/message'),
	NumericReplies = req('/constants/numeric-replies'),
	StructureItems = req('/constants/structure-items');

class ServerNamesReplyMessage extends ServerMessage {

}

extend(ServerNamesReplyMessage.prototype, {

	numeric_reply: NumericReplies.RPL_NAMREPLY,

	processMessagePartAtIndex(message_part, index) {
		if (index !== 2) {
			throw new Error('wat');
		}

		// TODO
	},

	getMessagePartAtIndex(index) {
		if (index !== 2) {
			throw new Error('wat');
		}

		// TODO
		return '=';
	},

	structure_definition: [
		StructureItems.NUMERIC_REPLY,
		StructureItems.NICK,
		// Channel privacy mask:
		StructureItems.OTHER,
		StructureItems.CHANNEL_NAME,
		StructureItems.BODY
	]

});

module.exports = ServerNamesReplyMessage;
