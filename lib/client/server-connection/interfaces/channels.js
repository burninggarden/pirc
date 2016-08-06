var req = require('req');

var
	has    = req('/utilities/has'),
	add    = req('/utilities/add'),
	remove = req('/utilities/remove');

var
	Channel        = req('/lib/client/channel'),
	NumericReplies = req('/constants/numeric-replies');

var
	ClientJoinMessage = req('/lib/client/messages/join'),
	ClientPartMessage = req('/lib/client/messages/part');

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
		switch (message.getNumericReply()) {
			case NumericReplies.RPL_TOPIC:
				return this.handleChannelTopicMessage(message);

			case NumericReplies.RPL_TOPICWHOTIME:
				return this.handleChannelTopicDetailsMessage(message);

			case NumericReplies.RPL_NAMREPLY:
				return this.handleChannelNamesReplyMessage(message);

			case NumericReplies.RPL_ENDOFNAMES:
				return this.handleChannelEndOfNamesMessage(message);
		}
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

		var message = new ClientJoinMessage();

		message.addChannelName(channel_name);

		this.sendMessage(message);

		var channel = new Channel(channel_name);

		channel.addJoinCallback(callback);

		add(channel).to(this.channels);

		this.channels_by_name[channel_name] = channel;
	},

	leaveChannelByName(channel_name, callback) {
		if (!this.isWithinChannel(channel_name)) {
			return void callback(new NotInChannelError(channel_name));
		}

		var message = new ClientPartMessage();

		message.addChannelName(channel_name);

		this.sendMessage(message);

		var channel = this.getChannelByName(channel_name);

		channel.addPartCallback(callback);

		remove(channel).from(this.channels);

		delete this.channels_by_name[channel_name];
	}

};


