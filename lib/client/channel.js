
var
	extend = req('/utilities/extend');

var
	Channel      = req('/lib/channel'),
	MessageEvent = req('/lib/client/events/message');


class ClientChannel extends Channel {

	constructor(name) {
		super(name);

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

		this.dispatchJoinCallbacks();
	}

	getUserDetailsForMessage(message) {
		return this.user_details_registry.getUserDetailsForMessage(message);
	}

	handleJoinMessage(message) {
		var client = this.getUserDetailsForMessage(message);

		this.emit('join', {
			channel: this,
			client:  client
		});
	}

	handlePartMessage(message) {
		var client = this.getUserDetailsForMessage(message);

		this.emit('part', {
			channel: this,
			client:  client
		});
	}

	handlePrivateMessage(message) {
		var client = this.getUserDetailsForMessage(message);

		var message_event = new MessageEvent();

		message_event.setChannel(this);
		message_event.setClient(client);
		message_event.setMessage(message);

		this.emit('message', message_event);
	}

	setUserDetailsRegistry(user_details_registry) {
		this.user_details_registry = user_details_registry;
		return this;
	}

	destroy() {
		this.join_callbacks           = null;
		this.part_callbacks           = null;
		this.names                    = null;
		this.queued_names             = null;
		this.user_details_registry  = null;
	}

}

extend(ClientChannel.prototype, {

	join_callbacks:        null,
	part_callbacks:        null,
	names:                 null,
	queued_names:          null,
	user_details_registry: null

});

module.exports = ClientChannel;
