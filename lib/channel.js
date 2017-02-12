var
	extend = req('/utilities/extend');


var
	TopicValidator     = req('/validators/topic'),
	NickValidator      = req('/validators/nick'),
	TimestampValidator = req('/validators/timestamp'),
	ChannelDetails     = req('/lib/channel-details'),
	EventEmitter       = require('events').EventEmitter;


class Channel extends EventEmitter {

	constructor(name) {
		super();

		this.setName(name);
	}

	setTopic(topic) {
		TopicValidator.validate(topic);
		this.topic = topic;
		return this;
	}

	getTopic() {
		TopicValidator.validate(this.topic);
		return this.topic;
	}

	setTopicAuthorNick(nick) {
		NickValidator.validate(nick);
		this.topic_author_nick = nick;
		return this;
	}

	getTopicAuthorNick() {
		NickValidator.validate(this.topic_author_nick);
		return this.topic_author_nick;
	}

	setTopicTimestamp(timestamp) {
		TimestampValidator.validate(timestamp);
		this.topic_timestamp = timestamp;
		return this;
	}

	getTopicTimestamp() {
		TimestampValidator.validate(this.timestamp);
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
	topic:             null,
	topic_author_nick: null,
	topic_timestamp:   null,
	url:               ''
});

module.exports = Channel;
