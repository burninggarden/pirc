var
	extend = req('/lib/utilities/extend');


var
	TopicValidator     = req('/lib/validators/topic'),
	NicknameValidator  = req('/lib/validators/nickname'),
	TimestampValidator = req('/lib/validators/timestamp'),
	ChannelDetails     = req('/lib/channel-details'),
	EventEmitter       = require('events').EventEmitter;


class Channel extends EventEmitter {

	constructor(name) {
		super();

		this.setName(name);
	}

	destroy() {
		this.channel_details = null;
	}

	setTopic(topic) {
		if (topic !== null) {
			TopicValidator.validate(topic);
		}

		this.topic = topic;
		return this;
	}

	getTopic() {
		if (this.topic !== null) {
			TopicValidator.validate(this.topic);
		}

		return this.topic;
	}

	setTopicAuthorNickname(nickname) {
		this.topic_author_nickname = nickname;
		return this;
	}

	getTopicAuthorNickname() {
		if (this.topic_author_nickname !== null) {
			NicknameValidator.validate(this.topic_author_nickname);
		}

		return this.topic_author_nickname;
	}

	setTopicTimestamp(timestamp) {
		if (timestamp !== null) {
			TimestampValidator.validate(timestamp);
		}

		this.topic_timestamp = timestamp;
		return this;
	}

	getTopicTimestamp() {
		if (this.topic_timestamp !== null) {
			TimestampValidator.validate(this.topic_timestamp);
		}

		return this.topic_timestamp;
	}

	setUrl(url) {
		this.url = url;
	}

	getUrl() {
		return this.url;
	}

	getChannelDetails() {
		if (!this.channel_details) {
			this.channel_details = new ChannelDetails();
		}

		return this.channel_details;
	}

	getName() {
		return this.getChannelDetails().getName();
	}

	getStandardizedName() {
		return this.getChannelDetails().getStandardizedName();
	}

	setName(name) {
		return this.getChannelDetails().setName(name);
	}

	handleModeMessage(message) {
		return this.getChannelDetails().handleModeMessage(message);
	}

}

extend(Channel.prototype, {
	channel_details:       null,
	topic:                 null,
	topic_author_nickname: null,
	topic_timestamp:       null,
	url:                   ''
});

module.exports = Channel;
