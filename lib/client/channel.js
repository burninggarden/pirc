
var
	extend = req('/utilities/extend');

var
	Channel = req('/lib/channel');


class ClientChannel extends Channel {

	constructor() {
		super();

		this.join_callbacks    = [ ];
		this.part_callbacks    = [ ];

		this.names             = [ ];
	}

	addJoinCallback(callback) {
		this.join_callbacks.push(callback);
	}

	addPartCallback(callback) {
		this.part_callbacks.push(callback);
	}

	dispatchJoinCallbacks(error) {
		while (this.join_callbacks.length) {
			this.join_callbacks.shift()(error, this);
		}
	}

	dispatchPartCallbacks(error) {
		while (this.part_callbacks.length) {
			this.part_callbacks.shift()(error, this);
		}
	}

	handleTopicMessage(message) {
		this.setTopic(message.getBody());
	}

	handleTopicDetailsMessage(message) {
		this.setTopicAuthorNick(message.getAuthorNick());
		this.setTopicTimestamp(message.getTimestamp());
	}

	handleNamesReplyMessage(message) {
		if (!this.queued_names) {
			this.queued_names = [ ];
		}

		this.queued_names = this.queued_names.concat(message.getNames());
	}

	handleEndOfNamesMessage(message) {
		this.names = this.queued_names;
		this.queued_names = null;
	}

}

extend(ClientChannel.prototype, {

	join_callbacks: null,
	part_callbacks: null,
	names:          null,
	queued_names:   null

});

module.exports = ClientChannel;
