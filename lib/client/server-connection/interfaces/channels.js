var req = require('req');

var
	has    = req('/utilities/has'),
	add    = req('/utilities/add'),
	remove = req('/utilities/remove');

var
	Channel       = req('/lib/client/channel'),
	ReplyNumerics = req('/constants/reply-numerics'),
	Commands      = req('/constants/commands');

var
	ClientJoinMessage    = req('/lib/client/messages/join'),
	ClientPartMessage    = req('/lib/client/messages/part'),
	ClientPrivateMessage = req('/lib/client/messages/private');

var
	AlreadyInChannelError = req('/lib/errors/already-in-channel'),
	NotInChannelError     = req('/lib/errors/not-in-channel');


module.exports = {

	channels:         null,
	channels_by_name: null,

	init() {
		this.channels         = [ ];
		this.channels_by_name = { };
	},

	handleMessage(message) {
		if (message.hasReplyNumeric()) {
			return this.handleReplyMessage(message);
		} else if (message.isCommand()) {
			return this.handleCommandMessage(message);
		} else {
			throw new Error(`
				Invalid message received; neither a reply nor command
			`);
		}
	},

	handleReplyMessage(message) {
		var numeric = message.getReplyNumeric();

		switch (numeric) {
			case ReplyNumerics.RPL_TOPIC:
				return this.handleChannelTopicMessage(message);

			case ReplyNumerics.RPL_TOPICWHOTIME:
				return this.handleChannelTopicDetailsMessage(message);

			case ReplyNumerics.RPL_NAMREPLY:
				return this.handleChannelNamesReplyMessage(message);

			case ReplyNumerics.RPL_ENDOFNAMES:
				return this.handleChannelEndOfNamesMessage(message);

			default:
				throw new Error(`
					Implement message parsing for reply numeric: ${numeric}
				`);
		}
	},

	handleCommandMessage(message) {
		var command = message.getCommand();

		switch (command) {
			case Commands.JOIN:
				return this.handleJoinMessage(message);

			case Commands.PART:
				return this.handlePartMessage(message);

			case Commands.PRIVMSG:
				if (message.hasChannelName()) {
					return this.handleChannelPrivateMessage(message);
				} else {
					throw new Error(`
						Implement PM parsing
					`);
				}

			default:
				throw new Error(`
					Implement message parsing for command: ${command}
				`);
		}
	},

	handleJoinMessage(message) {
		var
			channel_name = message.getChannelName(),
			channel      = this.getChannelByName(channel_name);

		channel.handleJoinMessage(message);

		if (message.getNick() === this.getNick()) {
			channel.dispatchJoinCallbacks();
		}
	},

	handlePartMessage(message) {
		var
			channel_name = message.getChannelName(),
			channel      = this.getChannelByName(channel_name);

		channel.handlePartMessage(message);

		if (message.getNick() === this.getNick()) {
			channel.dispatchPartCallbacks();
			channel.destroy();
		}
	},

	handleChannelPrivateMessage(message) {
		var
			channel_name = message.getChannelName(),
			channel      = this.getChannelByName(channel_name);

		channel.handlePrivateMessage(message);
	},

	handleChannelTopicMessage(message) {
		var channel_name = message.getChannelName();

		this.getChannelByName(channel_name).handleTopicMessage(message);
	},

	handleChannelTopicDetailsMessage(message) {
		var channel_name = message.getChannelName();

		this.getChannelByName(channel_name).handleTopicDetailsMessage(message);
	},

	handleChannelNamesReplyMessage(message) {
		var channel_name = message.getChannelName();

		this.getChannelByName(channel_name).handleNamesReplyMessage(message);
	},

	handleChannelEndOfNamesMessage(message) {
		var channel_name = message.getChannelName();

		this.getChannelByName(channel_name).handleEndOfNamesMessage(message);
	},

	getChannelByName(channel_name) {
		return this.channels_by_name[channel_name];
	},

	isWithinChannelName(channel_name) {
		var channel = this.getChannelByName(channel_name);

		if (!channel) {
			return false;
		}

		return has(this.channels, channel);
	},

	joinChannelByName(channel_name, callback) {
		if (this.isWithinChannelName(channel_name)) {
			return void callback(new AlreadyInChannelError(channel_name));
		}

		var channel = new Channel(channel_name);

		channel.setUserRegistry(this.getUserRegistry());

		channel.addJoinCallback(callback);
		add(channel).to(this.channels);
		this.channels_by_name[channel_name] = channel;

		var message = new ClientJoinMessage();

		message.addChannelName(channel_name);
		this.sendMessage(message);
	},

	leaveChannelByName(channel_name, callback) {
		if (!this.isWithinChannelName(channel_name)) {
			return void callback(new NotInChannelError(channel_name));
		}

		var channel = this.getChannelByName(channel_name);

		channel.addPartCallback(callback);
		remove(channel).from(this.channels);
		delete this.channels_by_name[channel_name];

		var message = new ClientPartMessage();

		message.addChannelName(channel_name);
		this.sendMessage(message);
	},

	sendTextToChannelByName(text, channel_name) {
		ClientPrivateMessage.getMultipleMessages({
			body:         text,
			channel_name: channel_name
		}).forEach(this.sendMessage, this);
	}

};


