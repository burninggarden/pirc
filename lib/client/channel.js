
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


class ClientChannel extends Channel {

	addJoinCallback(callback) {
		// NOTICE:
		// We're not using the add() helper here, because duplicate copies
		// of the same callback are okay.
		this.getJoinCallbacks().push(callback);
	}

	getJoinCallbacks() {
		if (!this.join_callbacks) {
			this.resetJoinCallbacks();
		}

		return this.join_callbacks;
	}

	resetJoinCallbacks() {
		var prior_callbacks = this.join_callbacks;

		this.join_callbacks = [ ];

		return prior_callbacks || [ ];
	}

	addPartCallback(callback) {
		// NOTICE:
		// We're not using the add() helper here, because duplicate copies
		// of the same callback are okay.
		this.getPartCallbacks().push(callback);
	}

	getPartCallbacks() {
		if (!this.part_callbacks) {
			this.resetPartCallbacks();
		}

		return this.part_callbacks;
	}

	resetPartCallbacks() {
		var prior_callbacks = this.part_callbacks;

		this.part_callbacks = [ ];

		return prior_callbacks || [ ];
	}

	addTopicCallback(callback) {
		// NOTICE:
		// We're not using the add() helper here, because duplicate copies
		// of the same callback are okay.
		this.getTopicCallbacks().push(callback);
	}

	getTopicCallbacks() {
		if (!this.topic_callbacks) {
			this.resetTopicCallbacks();
		}

		return this.topic_callbacks;
	}

	resetTopicCallbacks() {
		var prior_callbacks = this.topic_callbacks;

		this.topic_callbacks = [ ];

		return prior_callbacks || [ ];
	}

	addModeChangeCallback(callback) {
		// NOTICE:
		// We're not using the add() helper here, because duplicate copies
		// of the same callback are okay.
		this.getModeChangeCallbacks().push(callback);
	}

	getModeChangeCallbacks() {
		if (!this.mode_change_callbacks) {
			this.resetModeChangeCallbacks();
		}

		return this.mode_change_callbacks;
	}

	resetModeChangeCallbacks() {
		var prior_callbacks = this.mode_change_callbacks;

		this.mode_change_callbacks = [ ];

		return prior_callbacks || [ ];
	}

	addModeListCallback(callback) {
		// NOTICE:
		// We're not using the add() helper here, because duplicate copies
		// of the same callback are okay.
		this.getModeListCallbacks().push(callback);
	}

	getModeListCallbacks() {
		if (!this.mode_list_callbacks) {
			this.resetModeListCallbacks();
		}

		return this.mode_list_callbacks;
	}

	resetModeListCallbacks() {
		var prior_callbacks = this.mode_list_callbacks;

		this.mode_list_callbacks = [ ];

		return prior_callbacks || [ ];
	}

	dispatchJoinCallbacks(error) {
		var callbacks = this.resetJoinCallbacks();

		while (callbacks.length) {
			callbacks.shift()(error, this);
		}
	}

	dispatchPartCallbacks(error) {
		var callbacks = this.resetPartCallbacks();

		while (callbacks.length) {
			callbacks.shift()(error, this);
		}
	}

	dispatchTopicCallbacks(error) {
		var callbacks = this.resetTopicCallbacks();

		while (callbacks.length) {
			callbacks.shift()(error, this);
		}
	}

	dispatchModeChangeCallbacks(error) {
		var callbacks = this.resetModeChangeCallbacks();

		while (callbacks.length) {
			callbacks.shift()(error, this);
		}
	}

	dispatchModeListCallbacks(error) {
		var callbacks = this.resetModeListCallbacks();

		while (callbacks.length) {
			callbacks.shift()(error, this);
		}
	}

	handleNoTopicMessage(message) {
		this.setTopic(null);
		this.setTopicAuthorUserId(null);
		this.setTopicTimestamp(null);

		this.dispatchTopicCallbacks(null);
	}

	handleTopicMessage(message) {
		this.setTopic(message.getChannelTopic());
	}

	handleTopicDetailsMessage(message) {
		this.setTopicAuthorUserId(message.getAuthorUserId());
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

		this.setJoinIsComplete(true);
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

		var user_details = registry.getOrStoreUserDetailsForNickname(nickname);

		this.addUser(user_details);

		if (user_prefix) {
			user_details.setUserPrefixForChannel(user_prefix, this);
		}
	}

	addUser(user_details) {
		add(user_details).to(this.getUsers());
		user_details.addChannelName(this.getName());
	}

	removeUser(user_details) {
		remove(user_details).from(this.getUsers());

		user_details.removeChannelName(this.getName());
	}

	hasUser(user_details) {
		return has(this.getUsers(), user_details);
	}

	handleUrlMessage(message) {
		this.setUrl(message.getUrl());
	}

	getUserDetailsForMessage(message) {
		return this.user_details_registry.getUserDetailsForMessage(message);
	}

	handleJoinMessage(message) {
		if (!this.joinIsComplete()) {
			return;
		}

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
		var error = new Error('Not on channel: ' + message.getChannelName());

		this.dispatchTopicCallbacks(error);
	}

	handleNeedMoreModeParametersMessage(message) {
		var error = new Error('Need more mode parameters');

		this.dispatchModeChangeCallbacks(error);
	}

	setUserDetailsRegistry(user_details_registry) {
		this.user_details_registry = user_details_registry;
		return this;
	}

	getUserDetailsRegistry() {
		return this.user_details_registry;
	}

	destroy() {
		this.dispatchPartCallbacks();

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
		if (this.getUsers().length === 0) {
			return null;
		}

		return random(this.getUsers());
	}

	handleNoSuchChannelMessage(message) {
		var error = new Error('No such channel: ' + message.getChannelName());

		this.dispatchJoinCallbacks(error);
	}

	handleUnknownModeMessage(message) {
		var error = new Error('Invalid mode: ' + message.getMode());

		this.dispatchModeChangeCallbacks(error);
	}

	handleOperatorPrivilegesNeededMessage(message) {
		var error = new Error('Need operator privileges');

		this.dispatchModeChangeCallbacks(error);
		this.dispatchTopicCallbacks(error);
		// TODO: Dispatch other (currently unimplemented) callbacks, ie INVITE
	}

	handleChannelIsFullMessage(message) {
		var error = new Error('Channel is full');

		this.dispatchJoinCallbacks(error);
	}

	handleLinkChannelMessage(message) {
		var error = new Error(
			'Forwarding to channel: ' + message.getLinkedChannelName()
		);

		this.dispatchJoinCallbacks(error);
	}

	handleInviteOnlyMessage(message) {
		var error = new Error('Cannot join channel, is invite only');

		this.dispatchJoinCallbacks(error);
	}

	handleNeedReggedNickMessage(message) {
		var error = new Error('Cannot join channel, need regged nick');

		this.dispatchJoinCallbacks(error);
	}

	getNicknames() {
		return this.getUsers().map(this.getNicknameForUser, this);
	}

	getUsers() {
		if (!this.users) {
			this.users = [ ];
		}

		return this.users;
	}

	getNicknameForUser(user_details) {
		return user_details.getNickname();
	}

	joinIsComplete() {
		return this.join_is_complete;
	}

	setJoinIsComplete(join_is_complete) {
		this.join_is_complete = join_is_complete;
		return this;
	}

}

extend(ClientChannel.prototype, {

	users:                 null,
	join_callbacks:        null,
	part_callbacks:        null,
	topic_callbacks:       null,
	mode_change_callbacks: null,
	mode_list_callbacks:   null,
	queued_names:          null,
	user_details_registry: null,
	join_is_complete:      false

});

module.exports = ClientChannel;
