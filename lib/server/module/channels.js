
var
	add     = require('../../utility/add'),
	remove  = require('../../utility/remove'),
	extend  = require('../../utility/extend'),
	unique  = require('../../utility/unique'),
	flatten = require('../../utility/flatten');

var
	Server_Module  = require('../../server/module'),
	Server_Channel = require('../../server/channel'),
	ChannelDetails = require('../../channel-details');

var
	Enum_Commands    = require('../../enum/commands'),
	Enum_ModuleTypes = require('../../enum/module-types');


class Server_Module_Channels extends Server_Module {

	constructor() {
		super();

		this.channels_by_name = { };
	}

	getChannels() {
		if (!this.channels) {
			this.channels = [ ];
		}

		return this.channels;
	}

	coupleToClient() {
		// Deliberately a noop
	}

	decoupleFromClient(client) {
		this.getChannelsForClient(client).forEach(function each(channel) {
			channel.removeClient(client);
		});
	}

	getChannelsForClient(client) {
		return this.getChannels().filter(function filter(channel) {
			return channel.hasClient(client);
		});
	}

	getObserversForClient(client) {
		var channel_observers = this.getChannels().map(function map(channel) {
			return channel.getObserversForClient(client);
		});

		var result = unique(flatten(channel_observers));

		add(client).to(result);

		return result;
	}

	getOrCreateChannelForChannelName(channel_name) {
		return (
			   this.getChannelForChannelName(channel_name)
			|| this.createChannelForChannelName(channel_name)
		);
	}

	createChannelForChannelName(channel_name) {
		var
			channel        = new Server_Channel(channel_name),
			server_details = this.getServerDetails();

		channel.setServerDetails(server_details);

		var standardized_name = channel.getStandardizedName();

		this.channels_by_name[standardized_name] = channel;
		add(channel).to(this.getChannels());

		server_details.incrementChannelCount();

		return channel;
	}

	getChannelForChannelName(channel_name) {
		var standardized_name = ChannelDetails.standardizeName(channel_name);

		return this.channels_by_name[standardized_name] || null;
	}

	hasChannelForChannelName(channel_name) {
		return this.getChannelForChannelName(channel_name) !== null;
	}

	getChannelForChannelDetails(channel_details) {
		return this.getChannelForChannelName(channel_details.getName());
	}

	destroyChannel(channel) {
		var name = channel.getStandardizedName();

		delete this.channels_by_name[name];
		remove(channel).from(this.getChannels());

		channel.destroy();

		this.getServerDetails().decrementChannelCount();
	}

	addClientToChannelName(client, channel_name) {
		var channel = this.getOrCreateChannelForChannelName(channel_name);

		return channel.addClient(client);
	}

	removeClientFromChannelName(client, channel_name) {
		var channel = this.getChannelForChannelName(channel_name);

		if (!channel) {
			return void this.sendNoSuchChannelMessageToClientForChannelName(
				client,
				channel_name
			);
		}

		this.removeClientFromChannel(client, channel);
	}

	removeClientFromChannel(client, channel) {
		channel.removeClient(client);

		if (channel.isEmpty()) {
			this.destroyChannel(channel);
		}
	}

	sendNamesToClientForChannelName(client, channel_name) {
		var channel = this.getChannelForChannelName(channel_name);

		if (!channel || !channel.isVisibleToClient(client)) {
			return this.sendEndOfNamesMessageToClientForMissingChannelName(
				client,
				channel_name
			);
		}

		channel.sendNamesToClient(client);
	}

	sendNamesToClientForVisibleChannels(client) {
		this.getVisibleChannelsForClient(client).forEach(function each(channel) {
			channel.sendNamesToClient(client);
		});
	}

	sendNamesToClientForClientsNotInVisibleChannels(client) {
		var
			visible_clients  = this.getVisibleClientsForClient(client),
			visible_channels = this.getVisibleChannelsForClient(client);

		var filtered_clients = visible_clients.filter(function filter(client) {
			return this.isClientInAnyOfTheseChannels(client, visible_channels);
		}, this);

		(new Server_Channel('*'))
			.setServerDetails(this.getServerDetails())
			.setClients(filtered_clients)
			.sendNamesToClient(client);
	}

	sendEndOfNamesMessageToClientForMissingChannelName(client, channel_name) {
		(new Server_Channel(channel_name))
			.setServerDetails(this.getServerDetails())
			.sendEndOfNamesMessageToClient(client);
	}

	handleClientMessage(client, message) {
		var command = message.getCommand();

		switch (command) {
			case Enum_Commands.JOIN:
				return this.handleClientJoinMessage(client, message);

			case Enum_Commands.MODE:
				return this.handleClientModeMessage(client, message);

			case Enum_Commands.NAMES:
				return this.handleClientNamesMessage(client, message);

			case Enum_Commands.PART:
				return this.handleClientPartMessage(client, message);

			case Enum_Commands.PRIVMSG:
			case Enum_Commands.NOTICE:
				return this.handleClientGenericMessage(client, message);

			case Enum_Commands.TOPIC:
				return this.handleClientTopicMessage(client, message);

			default:
				throw new Error('Invalid command: ' + command);
		}

	}

	handleClientJoinMessage(client, message) {
		message.getChannelNames().forEach(function each(channel_name) {
			this.addClientToChannelName(client, channel_name);
		}, this);
	}

	handleClientModeMessage(client, message) {
		var channel_name = message.getChannelName();

		if (!this.hasChannelForChannelName(channel_name)) {
			return this.sendNoSuchChannelMessageToClientForChannelName(
				client,
				channel_name
			);
		}

		var channel = this.getChannelForChannelName(channel_name);

		channel.handleClientModeMessage(client, message);
	}

	handleClientNamesMessage(client, message) {
		if (message.hasChannelNames()) {
			message.getChannelNames().forEach(function each(channel_name) {
				this.sendNamesToClientForChannelName(client, channel_name);
			}, this);
		} else {
			// If no channel name parameters were specified,
			// we should return names for all channels visible to the client,
			// as well as the names of all other users who are not in channels
			// visible to the client.
			this.sendNamesToClientForVisibleChannels(client);
			this.sendNamesToClientForClientsNotInVisibleChannels(client);
		}
	}

	handleClientPartMessage(client, message) {
		message.getChannelNames().forEach(function each(channel_name) {
			this.removeClientFromChannelName(client, channel_name);
		}, this);
	}

	handleClientGenericMessage(client, message) {
		client.getUserDetails().bumpIdleStartTimestamp();

		var channel_targets = message.getChannelMessageTargets();

		channel_targets.forEach(function each(channel_name) {
			this.handleClientMessageToChannelName(client, message, channel_name);
		}, this);
	}

	handleClientMessageToChannelName(client, message, channel_name) {
		var channel = this.getChannelForChannelName(channel_name);

		if (!channel) {
			return void this.sendNoSuchChannelMessageToClientForChannelName(
				client,
				channel_name
			);
		}

		channel.handleClientMessage(client, message);
	}

	handleClientTopicMessage(client, message) {
		var
			channel_name = message.getChannelName(),
			channel      = this.getChannelForChannelName(channel_name);

		if (!channel) {
			return this.sendNoSuchChannelMessageToClientForChannelName(
				client,
				channel_name
			);
		}

		channel.handleClientTopicMessage(client, message);
	}

}

extend(Server_Module_Channels.prototype, {
	type:             Enum_ModuleTypes.CHANNELS,
	channels:         null,
	channels_by_name: null
});

module.exports = Server_Module_Channels;
