var
	extend = req('/utilities/extend');


var
	ChannelNameValidator = req('/validators/channel-name'),
	TopicValidator       = req('/validators/topic'),
	NickValidator        = req('/validators/nick'),
	TimestampValidator   = req('/validators/timestamp'),
	EventEmitter         = require('events').EventEmitter,
	TargetTypes          = req('/constants/target-types');


class Channel extends EventEmitter {

	constructor(name) {
		super();
		this.name = name;
	}

	getName() {
		ChannelNameValidator.validate(this.name);
		return this.name;
	}

	setName(name) {
		ChannelNameValidator.validate(name);
		this.name = name;
		return this;
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
		TimestampValidator.validateTimestamp(timestamp);
		this.topic_timestamp = timestamp;
		return this;
	}

	getTopicTimestamp() {
		TimestampValidator.validateTimestamp(this.timestamp);
		return this.topic_timestamp;
	}

	getTargetType() {
		return TargetTypes.CHANNEL;
	}

	getTargetString() {
		return this.getName();
	}

}

extend(Channel.prototype, {
	name:              null,
	topic:             null,
	topic_author_nick: null,
	topic_timestamp:   null
});

module.exports = Channel;
