var req = require('req');

var
	extend         = req('/utilities/extend'),
	ServerMessage  = req('/lib/server/message'),
	NumericReplies = req('/constants/numeric-replies'),
	StructureItems = req('/constants/structure-items');

class ServerNamesReplyMessage extends ServerMessage {

	constructor(channel_name, names_chunk) {
		super();

		this.channel_name = channel_name;
		this.body = names_chunk;
	}

}

extend(ServerNamesReplyMessage.prototype, {

	numeric_reply:        NumericReplies.RPL_ENDOFNAMES,

	structure_definition: [
		StructureItems.NUMERIC_REPLY,
		StructureItems.NICK,
		StructureItems.NAMES_DELIMITER,
		StructureItems.CHANNEL_NAME,
		StructureItems.BODY
	]

});

module.exports = ServerNamesReplyMessage;
