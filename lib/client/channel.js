
var
	extend = req('/utilities/extend');

var
	Channel = req('/lib/channel');


class ClientChannel extends Channel {

	constructor(name) {
		super(name);

		this.join_callbacks    = [ ];
		this.part_callbacks    = [ ];
		this.names             = [ ];
		this.users             = [ ];
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

	getOrCreateUserForMessage(message) {
		return this.user_registry.getOrCreateUserForMessage(message);
	}

	handleJoinMessage(message) {
		var user = this.getOrCreateUserForMessage(message);

		this.emit('join', {
			channel: this,
			user:    user
		});
	}

	handlePartMessage(message) {
		var user = this.getOrCreateUserForMessage(message);

		this.emit('part', {
			channel: this,
			user:    user
		});
	}

	handlePrivateMessage(message) {
		var user = this.getOrCreateUserForMessage(message);

		this.emit('message', {
			channel: this,
			user:    user,
			body:    message.getBody()
		});
	}

	setUserRegistry(user_registry) {
		this.user_registry = user_registry;
		return this;
	}

	destroy() {
		this.join_callbacks = null;
		this.part_callbacks = null;
		this.names          = null;
		this.queued_names   = null;
		this.users          = null;
		this.user_registry  = null;
	}

}

extend(ClientChannel.prototype, {

	join_callbacks: null,
	part_callbacks: null,
	names:          null,
	queued_names:   null,
	users:          null,
	user_registry:  null

});

module.exports = ClientChannel;
