
var
	extend         = req('/utilities/extend'),
	ServerMessage  = req('/lib/server/message'),
	NumericReplies = req('/constants/numeric-replies'),
	StructureItems = req('/constants/structure-items');



class BannedFromChannelMessage extends ServerMessage {

	constructor(channel_name) {
		super();

		this.setChannelName(channel_name);
	}

}

extend(BannedFromChannelMessage.prototype, {
	numeric_reply:        NumericReplies.ERR_BANNEDFROMCHAN,
	channel_name:         null,
	body:                 "You're banned from this channel",

	structure_definition: [
		StructureItems.NUMERIC_REPLY,
		StructureItems.TARGET_NICK,
		StructureItems.CHANNEL_NAME,
		StructureItems.BODY
	]
});

module.exports = BannedFromChannelMessage;
