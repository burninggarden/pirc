
var
	extend = req('/utilities/extend'),
	add    = req('/utilities/add'),
	remove = req('/utilities/remove'),
	random = req('/utilities/random'),
	has    = req('/utilities/has');

var
	Channel             = req('/lib/channel'),
	MessageEvent        = req('/lib/client/events/message'),
	ChannelUserPrefixes = req('/constants/channel-user-prefixes');


class ClientChannel extends Channel {

	constructor(name) {
		super(name);

		this.join_callbacks    = [ ];
		this.part_callbacks    = [ ];
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
		this.setTopic(message.getTopic());
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
		this.queued_names.forEach(this.addUserByNick, this);
		this.queued_names = null;

		this.dispatchJoinCallbacks();
	}

	addUserByNick(nick) {
		var registry = this.getUserDetailsRegistry();

		var user_prefix = nick.slice(0, 1);

		if (has(ChannelUserPrefixes, user_prefix)) {
			nick = nick.slice(1);
		} else {
			user_prefix = null;
		}

		var user_details = registry.getOrStoreUserDetailsForNick(nick);

		this.addUser(user_details);

		if (user_prefix) {
			user_details.setUserPrefixForChannel(user_prefix, this);
		}
	}

	addUser(user_details) {
		add(user_details).to(this.users);
		user_details.addChannelName(this.getName());
	}

	removeUser(user_details) {
		remove(user_details).from(this.users);

		user_details.removeChannelName(this.getName());
	}

	hasUser(user_details) {
		return has(this.users, user_details);
	}

	handleUrlMessage(message) {
		this.setUrl(message.getUrl());
	}

	getUserDetailsForMessage(message) {
		return this.user_details_registry.getUserDetailsForMessage(message);
	}

	handleJoinMessage(message) {
		var user_details = this.getUserDetailsForMessage(message);

		this.emit('join', {
			channel: this,
			user:    user_details
		});

		this.addUser(user_details);
	}

	handlePartMessage(message) {
		var user_details = this.getUserDetailsForMessage(message);

		this.emit('part', {
			channel: this,
			user:    user_details
		});

		this.removeUser(user_details);
	}

	handlePrivateMessage(message) {
		var user_details = this.getUserDetailsForMessage(message);

		var message_event = new MessageEvent();

		message_event.setChannel(this);
		message_event.setUser(user_details);
		message_event.setMessage(message);

		this.emit('message', message_event);
	}

	handleQuitMessage(message) {
		var user_details = this.getUserDetailsForMessage(message);

		if (this.hasUser(user_details)) {
			this.removeUser(user_details);
		}
	}

	setUserDetailsRegistry(user_details_registry) {
		this.user_details_registry = user_details_registry;
		return this;
	}

	getUserDetailsRegistry() {
		return this.user_details_registry;
	}

	destroy() {
		this.join_callbacks           = null;
		this.part_callbacks           = null;
		this.queued_names             = null;
		this.user_details_registry  = null;
	}

	getRandomNick() {
		var user = this.getRandomUser();

		if (!user) {
			return null;
		}

		return user.getNick();
	}

	getRandomUser() {
		if (this.users.length === 0) {
			return null;
		}

		return random(this.users);
	}

}

extend(ClientChannel.prototype, {

	join_callbacks:        null,
	part_callbacks:        null,
	queued_names:          null,
	user_details_registry: null

});

module.exports = ClientChannel;
