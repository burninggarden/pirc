
var
	extend         = req('/utilities/extend'),
	ServerMessage  = req('/lib/server/message'),
	NumericReplies = req('/constants/numeric-replies'),
	StructureItems = req('/constants/structure-items');



class ChannelTopicMessage extends ServerMessage {

	constructor(channel_name, channel_topic) {
		super();

		this.body = channel_topic;
	}

}

extend(ChannelTopicMessage.prototype, {
	numeric_reply:        NumericReplies.RPL_TOPIC,
	channel_name:         null,
	body:                 null,

	structure_definition: [
		StructureItems.NUMERIC_REPLY,
		StructureItems.NICK,
		StructureItems.CHANNEL_NAME,
		StructureItems.BODY
	]
});

module.exports = ChannelTopicMessage;
