var req = require('req');

var
	extend = req('/utilities/extend');

var
	Service  = req('/lib/server/service'),
	Commands = req('/constants/commands'),
	Channel  = req('/lib/server/channel');


class ChannelService extends Service {

	constructor() {
		super();

		this.channels         = [ ];
		this.channels_by_name = { };
	}

	registerClient() {
		// Deliberately a noop
	}

	unregisterClient() {
		// Deliberately a noop
	}

	getOrCreateChannelByName(channel_name) {
		return (
			   this.getChannelByName(channel_name)
			|| this.createChannelForName(channel_name)
		);
	}

	createChannelForName(channel_name) {
		return new Channel(channel_name);
	}

	getChannelByName(channel_name) {
		return this.channels_by_name[channel_name];
	}

	addClientToChannelByName(client, channel_name) {
		var channel = this.getOrCreateChannelByName(channel_name);

		return channel.addClient(client);
	}

	removeClientFromChannelByName(client, channel_name) {
		var existing_channel = this.getChannelByName(channel_name);

		if (existing_channel) {
			return existing_channel.removeClient(client);
		} else {
			throw new Error('fix this');
		}
	}

	handleClientMessage(client, message) {
		var command = message.getCommand();

		switch (command) {
			case Commands.JOIN:
				return this.handleClientJoinMessage(client, message);

			case Commands.PART:
				return this.handleClientPartMessage(client, message);
		}

	}

	handleClientJoinMessage(client, message) {
		message.getChannelNames().forEach(function each(channel_name) {
			this.addClientToChannelByName(client, channel_name);
		}, this);
	}

	handleClientPartMessage(client, message) {
		message.getChannelNames().forEach(function each(channel_name) {
			this.removeClientFromChannelByName(client, channel_name);
		}, this);
	}

}

extend(ChannelService, {
	channels:         null,
	channels_by_name: null
});

module.exports = ChannelService;