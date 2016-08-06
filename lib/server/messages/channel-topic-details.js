
var
	extend             = req('/utilities/extend'),
	ServerMessage      = req('/lib/server/message'),
	NumericReplies     = req('/constants/numeric-replies'),
	StructureItems     = req('/constants/structure-items'),
	NickValidator      = req('/validators/nick'),
	TimestampValidator = req('/validators/timestamp');



class ChannelTopicDetailsMessage extends ServerMessage {

	setAuthorNick(nick) {
		NickValidator.validate(nick);
		this.author_nick = nick;
		return this;
	}

	getAuthorNick() {
		return this.author_nick;
	}

	setTimestamp(timestamp) {
		TimestampValidator.validate(timestamp);
		this.timestamp = timestamp;
		return this;
	}

	getTimestamp() {
		return this.timestamp;
	}

	getBody() {
		return this.getAuthorNick() + ' ' + this.getTimestamp();
	}

}

extend(ChannelTopicDetailsMessage.prototype, {
	numeric_reply:        NumericReplies.RPL_TOPICWHOTIME,

	author_nick:          null,
	timestamp:            null,

	structure_definition: [
		StructureItems.SERVER_NAME,
		StructureItems.NUMERIC_REPLY,
		StructureItems.NICK,
		StructureItems.CHANNEL_NAME,
		StructureItems.BODY
	]
});

module.exports = ChannelTopicDetailsMessage;
