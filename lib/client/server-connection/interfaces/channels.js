var req = require('req');

var
	has = req('/utilities/has');

var
	Channel = req('/lib/channel');

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
	},

	leaveChannelByName(channel_name, callback) {
		if (!this.isWithinChannel(channel_name)) {
			return void callback(new NotInChannelError(channel_name));
		}

		var message = new ClientPartMessage();

		message.addChannelName(channel_name);

		this.sendMessage(message);
	}

};


