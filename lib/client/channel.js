
var
	extend = require('../utility/extend'),
	add    = require('../utility/add'),
	remove = require('../utility/remove'),
	random = require('../utility/random'),
	has    = require('../utility/has');

var
	Channel                  = require('../channel'),
	Client_Event_Message     = require('./event/message'),
	Enum_ChannelUserPrefixes = require('../enum/channel-user-prefixes');


class Client_Channel extends Channel {

	addUsersFromNicknames(nicknames) {
		nicknames.forEach(this.addUserByNickname, this);
	}

	addUserByNickname(nickname) {
		var registry = this.getUserDetailsRegistry();

		var user_prefix = nickname.slice(0, 1);

		if (has(Enum_ChannelUserPrefixes, user_prefix)) {
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

		var message_event = new Client_Event_Message();

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

extend(Client_Channel.prototype, {

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

module.exports = Client_Channel;
