
var
	extend = req('/utilities/extend'),
	add    = req('/utilities/add'),
	remove = req('/utilities/remove'),
	has    = req('/utilities/has');

var
	Channel                  = req('/lib/channel'),
	MessageEvent             = req('/lib/client/events/message'),
	ChannelUserModeValidator = req('/validators/channel-user-mode'),
	ChannelNickPrefixes      = req('/constants/channel-nick-prefixes');


class ClientChannel extends Channel {

	constructor(name) {
		super(name);

		this.join_callbacks    = [ ];
		this.part_callbacks    = [ ];
		this.users             = [ ];
		this.user_modes = [ ];
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

		var nick_prefix = nick.slice(0, 1);

		if (has(ChannelNickPrefixes, nick_prefix)) {
			nick = nick.slice(1);
		} else {
			nick_prefix = null;
		}

		var user_details = registry.getOrStoreUserDetailsForNick(nick);

		this.addUser(user_details);

		if (nick_prefix) {
			this.setNickPrefixForUser(nick_prefix, user_details);
		}
	}

	setNickPrefixForUser(nick_prefix, user_details) {
		var channel_mode = this.getChannelUserModeForNickPrefix(nick_prefix);

		this.addChannelUserModeForUser(channel_mode, user_details);
	}

	addChannelUserModeForUser(channel_user_mode, user_details) {
		ChannelUserModeValidator.validate(channel_user_mode);

		add(channel_user_mode).to(this.getChannelUserModesForUser(user_details));
	}

	getChannelUserModesForUser(user_details) {
		var unique_id = user_details.getUniqueId();

		if (this.user_modes[unique_id] === undefined) {
			this.user_modes[unique_id] = [ ];
		}

		return this.user_modes[unique_id];
	}

	addUser(user_details) {
		add(user_details).to(this.users);
	}

	removeUser(user_details) {
		remove(user_details).from(this.users);

		var unique_id = user_details.getUniqueId();

		delete this.user_modes[unique_id];
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
	user_details_registry: null,
	user_modes:            null

});

module.exports = ClientChannel;
