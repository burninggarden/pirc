
var
	extend         = req('/utilities/extend'),
	ServerMessage  = req('/lib/server/message'),
	NumericReplies = req('/constants/numeric-replies'),
	StructureItems = req('/constants/structure-items');



class InviteOnlyChannelMessage extends ServerMessage {

	constructor(nick, channel) {
		super();

		this.nick    = nick;
		this.channel = channel;
	}

}

extend(InviteOnlyChannelMessage.prototype, {
	numeric_reply:        NumericReplies.ERR_INVITEONLYCHAN,
	nick:                 null,
	channel:              null,
	body:                 'This channel requires an invitation to join',

	structure_definition: [
		StructureItems.NUMERIC_REPLY,
		StructureItems.NICK,
		StructureItems.CHANNEL,
		StructureItems.BODY
	]
});

module.exports = InviteOnlyChannelMessage;
