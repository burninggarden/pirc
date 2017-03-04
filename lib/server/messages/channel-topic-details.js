
var
	extend             = req('/utilities/extend'),
	ServerMessage      = req('/lib/server/message'),
	ReplyNumerics      = req('/constants/reply-numerics'),
	TimestampValidator = req('/validators/timestamp');



class ChannelTopicDetailsMessage extends ServerMessage {

	setAuthorIdentifier(identifier) {
		this.author_identifier = identifier;
		return this;
	}

	getAuthorIdentifier() {
		return this.author_identifier;
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
			targets           = this.serializeTargets(),
			channel_name      = this.getChannelDetails().getName(),
			author_identifier = this.getAuthorIdentifier(),
			timestamp         = this.getTimestamp();

		return `${targets} ${channel_name} ${author_identifier} ${timestamp}`;
	}

	applyParsedParams(middle_params, trailing_param) {
		this.addTargetFromString(middle_params.shift());
		this.getChannelDetails().setName(middle_params.shift());
		this.setAuthorIdentifier(middle_params.shift());

		var timestamp = parseInt(middle_params.shift());

		this.setTimestamp(timestamp);
	}

}

extend(ChannelTopicDetailsMessage.prototype, {
	reply_numeric:     ReplyNumerics.RPL_TOPICWHOTIME,

	author_identifier: null,
	timestamp:         null
});

module.exports = ChannelTopicDetailsMessage;
