
var
	extend         = req('/utilities/extend'),
	ServerMessage  = req('/lib/server/message'),
	NumericReplies = req('/constants/numeric-replies'),
	StructureItems = req('/constants/structure-items');



class ServerNotOnChannelMessage extends ServerMessage {

	constructor(nick, channel) {
		super();

		this.nick    = nick;
		this.channel = channel;
	}

}

extend(ServerNotOnChannelMessage.prototype, {
	numeric_reply:        NumericReplies.ERR_NOTONCHANNEL,
	nick:                 null,
	channel:              null,
	body:                 "You're not on that channel",

	structure_definition: [
		StructureItems.NUMERIC_REPLY,
		StructureItems.NICK,
		StructureItems.CHANNEL,
		StructureItems.BODY
	]
});

module.exports = ServerNotOnChannelMessage;
