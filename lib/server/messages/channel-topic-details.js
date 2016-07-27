
var
	extend         = req('/utilities/extend'),
	ServerMessage  = req('/lib/server/message'),
	NumericReplies = req('/constants/numeric-replies'),
	StructureItems = req('/constants/structure-items');



class ChannelTopicDetailsMessage extends ServerMessage {

	constructor(channel_name, channel_topic_details) {
		super();

		this.body = channel_topic_details;
	}

}

extend(ChannelTopicDetailsMessage.prototype, {
	numeric_reply:        NumericReplies.RPL_TOPICWHOTIME,
	channel_name:         null,
	body:                 null,

	structure_definition: [
		StructureItems.NUMERIC_REPLY,
		StructureItems.NICK,
		StructureItems.CHANNEL_NAME,
		StructureItems.BODY
	]
});

module.exports = ChannelTopicDetailsMessage;
