var
	extend = req('/utilities/extend');


class Channel {

	constructor(name) {
		this.name = name;
	}

	setTopic(topic) {
		this.topic = topic;
		return this;
	}

	getTopic() {
		return this.topic;
	}

	setTopicAuthorNick(nick) {
		this.topic_author_nick = nick;
		return this;
	}

	getTopicAuthorNick() {
		return this.topic_author_nick;
	}

	setTopicTimestamp(timestamp) {
		this.topic_timestamp = timestamp;
		return this;
	}

	getTopicTimestamp() {
		return this.topic_timestamp;
	}


}

extend(Channel.prototype, {
	name:              null,
	topic:             null,
	topic_author_nick: null,
	topic_timestamp:   null
});

module.exports = Channel;
