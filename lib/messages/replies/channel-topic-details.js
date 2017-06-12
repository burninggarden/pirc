
var
	extend             = req('/lib/utilities/extend'),
	ReplyMessage       = req('/lib/messages/reply'),
	ReplyNumerics      = req('/lib/constants/reply-numerics'),
	TimestampValidator = req('/lib/validators/timestamp');



class ChannelTopicDetailsMessage extends ReplyMessage {

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

	serializeParameters() {
		var
			targets           = this.serializeTargets(),
			channel_name      = this.getChannelDetails().getName(),
			author_identifier = this.getAuthorIdentifier(),
			timestamp         = this.getTimestamp();

		return `${targets} ${channel_name} ${author_identifier} ${timestamp}`;
	}

	applyParsedParameters(middle_parameters, trailing_parameter) {
		this.addTargetFromString(middle_parameters.shift());
		this.getChannelDetails().setName(middle_parameters.shift());
		this.setAuthorIdentifier(middle_parameters.shift());

		var timestamp = parseInt(middle_parameters.shift());

		this.setTimestamp(timestamp);
	}

}

extend(ChannelTopicDetailsMessage.prototype, {
	reply_numeric:     ReplyNumerics.RPL_TOPICWHOTIME,

	author_identifier: null,
	timestamp:         null
});

module.exports = ChannelTopicDetailsMessage;
