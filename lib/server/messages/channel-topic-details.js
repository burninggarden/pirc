
var
	extend             = req('/utilities/extend'),
	Regexes            = req('/constants/regexes'),
	UserDetails        = req('/lib/user-details'),
	ServerMessage      = req('/lib/server/message'),
	ReplyNumerics      = req('/constants/reply-numerics'),
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

	serializeParams() {
		var
			targets      = this.serializeTargets(),
			channel_name = this.getChannelDetails().getName(),
			author_nick  = this.getAuthorNick(),
			timestamp    = this.getTimestamp();

		return `${targets} ${channel_name} ${author_nick} ${timestamp}`;
	}

	applyParsedParams(middle_params, trailing_param) {
		this.addTargetFromString(middle_params[0]);
		this.getChannelDetails().setName(middle_params[1]);

		var author = middle_params[2];

		if (Regexes.NICK.test(author)) {
			this.setAuthorNick(middle_params[2]);
		} else if (Regexes.USER_IDENTIFIER.test(author)) {
			let user_details = UserDetails.fromIdentifier(author);

			this.setAuthorNick(user_details.getNick());
		}

		var timestamp = parseInt(middle_params[3]);

		this.setTimestamp(timestamp);
	}

}

extend(ChannelTopicDetailsMessage.prototype, {
	reply_numeric: ReplyNumerics.RPL_TOPICWHOTIME,

	author_nick:   null,
	timestamp:     null
});

module.exports = ChannelTopicDetailsMessage;
