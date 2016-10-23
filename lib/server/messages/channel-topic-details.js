
var
	extend             = req('/utilities/extend'),
	ServerMessage      = req('/lib/server/message'),
	ReplyNumerics      = req('/constants/reply-numerics'),
	NickValidator      = req('/validators/nick'),
	TimestampValidator = req('/validators/timestamp');



class ChannelTopicDetailsMessage extends ServerMessage {

	isFromServer() {
		return true;
	}

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
	reply_numeric: ReplyNumerics.RPL_TOPICWHOTIME,

	author_nick:   null,
	timestamp:     null
});

module.exports = ChannelTopicDetailsMessage;
