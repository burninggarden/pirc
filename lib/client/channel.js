
var
	extend = req('/lib/utilities/extend'),
	add    = req('/lib/utilities/add'),
	remove = req('/lib/utilities/remove'),
	random = req('/lib/utilities/random'),
	has    = req('/lib/utilities/has');

var
	Channel             = req('/lib/channel'),
	MessageEvent        = req('/lib/client/events/message'),
	ChannelUserPrefixes = req('/lib/constants/channel-user-prefixes');

var
	InvalidNicknameError = req('/lib/errors/invalid-nickname');


class ClientChannel extends Channel {

	constructor(name) {
		super(name);

		this.join_callbacks  = [ ];
		this.part_callbacks  = [ ];
		this.topic_callbacks = [ ];
		this.mode_callbacks  = [ ];
		this.users           = [ ];
	}

	addJoinCallback(callback) {
		// NOTICE:
		// We're not using the add() helper here, because duplicate copies
		// of the same callback are okay.
		this.join_callbacks.push(callback);
	}

	addPartCallback(callback) {
		// NOTICE:
		// We're not using the add() helper here, because duplicate copies
		// of the same callback are okay.
		this.part_callbacks.push(callback);
	}

	addTopicCallback(callback) {
		// NOTICE:
		// We're not using the add() helper here, because duplicate copies
		// of the same callback are okay.
		this.topic_callbacks.push(callback);
	}

	addModeCallback(callback) {
		// NOTICE:
		// We're not using the add() helper here, because duplicate copies
		// of the same callback are okay.
		this.mode_callbacks.push(callback);
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

	dispatchTopicCallbacks(error) {
		while (this.topic_callbacks.length) {
			this.topic_callbacks.shift()(error, this);
		}
	}

	dispatchModeCallbacks(error) {
		while (this.mode_callbacks.length) {
			this.mode_callbacks.shift()(error, this);
		}
	}

	handleNoTopicMessage(message) {
		this.setTopic(null);
		this.setTopicAuthorNickname(null);
		this.setTopicTimestamp(null);

		this.dispatchTopicCallbacks(null);
	}

	handleTopicMessage(message) {
		this.setTopic(message.getTopic());
	}

	handleTopicDetailsMessage(message) {
		this.setTopicAuthorNickname(message.getAuthorNickname());
		this.setTopicTimestamp(message.getTimestamp());

		this.dispatchTopicCallbacks(null);
	}

	handleNamesReplyMessage(message) {
		if (!this.queued_names) {
			this.queued_names = [ ];
		}

		this.queued_names = this.queued_names.concat(message.getNames());
	}

	handleEndOfNamesMessage(message) {
		this.queued_names.forEach(this.addUserByNickname, this);
		this.queued_names = null;

		this.dispatchJoinCallbacks();
	}

	addUserByNickname(nickname) {
		var registry = this.getUserDetailsRegistry();

		var user_prefix = nickname.slice(0, 1);

		if (has(ChannelUserPrefixes, user_prefix)) {
			nickname = nickname.slice(1);
		} else {
			user_prefix = null;
		}

		var user_details;

		try {
			user_details = registry.getOrStoreUserDetailsForNickname(nickname);
		} catch (error) {
			if (error instanceof InvalidNicknameError) {
				// TODO: properly bubble this up via events.
				return void console.error(error);
			} else {
				throw error;
			}
		}

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

	handleNotOnChannelMessage(message) {
		var error = message.toError();

		this.dispatchTopicCallbacks(error);
	}

	handleNeedMoreModeParametersMessage(message) {
		var error = message.toError();

		this.dispatchModeCallbacks(error);
	}

	setUserDetailsRegistry(user_details_registry) {
		this.user_details_registry = user_details_registry;
		return this;
	}

	getUserDetailsRegistry() {
		return this.user_details_registry;
	}

	destroy() {
		this.join_callbacks         = null;
		this.part_callbacks         = null;
		this.queued_names           = null;
		this.user_details_registry  = null;
	}

	getRandomNickname() {
		var user = this.getRandomUser();

		if (!user) {
			return null;
		}

		return user.getNickname();
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
	topic_callbacks:       null,
	queued_names:          null,
	user_details_registry: null

});

module.exports = ClientChannel;
