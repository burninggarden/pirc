var
	extend = req('/lib/utility/extend');


var
	Validator_Topic     = req('/lib/validator/topic'),
	Validator_Timestamp = req('/lib/validator/timestamp'),
	ChannelDetails      = req('/lib/channel-details'),
	EventEmitter        = require('events').EventEmitter;


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
			Validator_Topic.validate(topic);
		}

		this.topic = topic;
		return this;
	}

	getTopic() {
		if (this.topic !== null) {
			Validator_Topic.validate(this.topic);
		}

		return this.topic;
	}

	setTopicAuthorUserId(user_id) {
		this.topic_author_user_id = user_id;
		return this;
	}

	getTopicAuthorUserId() {
		return this.topic_author_user_id;
	}

	setTopicTimestamp(timestamp) {
		if (timestamp !== null) {
			timestamp = parseInt(timestamp);
			Validator_Timestamp.validate(timestamp);
		}

		this.topic_timestamp = timestamp;
		return this;
	}

	getTopicTimestamp() {
		if (this.topic_timestamp !== null) {
			Validator_Timestamp.validate(this.topic_timestamp);
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
	channel_details:      null,
	topic:                null,
	topic_author_user_id: null,
	topic_timestamp:      null,
	url:                  ''
});

module.exports = Channel;
