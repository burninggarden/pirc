var req = require('req');

var
	add     = req('/utilities/add'),
	remove  = req('/utilities/remove'),
	extend  = req('/utilities/extend'),
	unique  = req('/utilities/unique'),
	flatten = req('/utilities/flatten');

var
	Service        = req('/lib/server/service'),
	Commands       = req('/constants/commands'),
	Channel        = req('/lib/server/channel'),
	ErrorReasons   = req('/constants/error-reasons'),
	ChannelDetails = req('/lib/channel-details'),
	ServiceTypes   = req('/constants/service-types');

var
	InvalidCommandError    = req('/lib/errors/invalid-command'),
	NotYetImplementedError = req('/lib/errors/not-yet-implemented');


class ChannelService extends Service {

	constructor() {
		super();

		this.channels         = [ ];
		this.channels_by_name = { };
	}

	coupleToClient() {
		// Deliberately a noop
	}

	decoupleFromClient() {
		// Deliberately a noop
	}

	getObserversForClient(client) {
		var channel_observers = this.channels.map(function map(channel) {
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
			channel           = new Channel(channel_name),
			standardized_name = channel.getStandardizedName();

		this.channels_by_name[standardized_name] = channel;
		add(channel).to(this.channels);

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
		channel.destroy();

		var name = channel.getStandardizedName();

		delete this.channels_by_name[name];
		remove(channel).from(this.channels);
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

		(new Channel('*'))
			.setClients(filtered_clients)
			.sendNamesToClient(client);
	}

	sendEndOfNamesMessageToClientForMissingChannelName(client, channel_name) {
		(new Channel(channel_name)).sendEndOfNamesMessageToClient(client);
	}

	handleClientMessage(client, message) {
		var command = message.getCommand();

		switch (command) {
			case Commands.JOIN:
				return this.handleClientJoinMessage(client, message);

			case Commands.MODE:
				return this.handleClientModeMessage(client, message);

			case Commands.NAMES:
				return this.handleClientNamesMessage(client, message);

			case Commands.PART:
				return this.handleClientPartMessage(client, message);

			case Commands.PRIVMSG:
			case Commands.NOTICE:
				return this.handleClientGenericMessage(client, message);

			case Commands.TOPIC:
				return this.handleClientTopicMessage(client, message);

			default:
				throw new InvalidCommandError(command, ErrorReasons.UNSUPPORTED);
		}

	}

	handleClientJoinMessage(client, message) {
		message.getChannelNames().forEach(function each(channel_name) {
			this.addClientToChannelName(client, channel_name);
		}, this);
	}

	handleClientModeMessage(client, message) {
		message.getChannelNames().forEach(function each(channel_name) {
			if (!this.hasChannelForChannelName(channel_name)) {
				return this.sendNoSuchChannelMessageToClientForChannelName(
					client,
					channel_name
				);
			}

			var channel = this.getChannelForChannelName(channel_name);

			channel.handleClientModeMessage(client, message);
		}, this);
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

		var channel_targets = message.getChannelTargets();

		channel_targets.forEach(function each(channel) {
			this.handleClientMessageToChannel(client, message, channel);
		}, this);
	}

	handleClientMessageToChannel(client, message, channel_details) {
		var channel = this.getChannelForChannelDetails(channel_details);

		if (!channel) {
			let channel_name = channel_details.getName();

			return void this.sendNoSuchChannelMessageToClientForChannelName(
				client,
				channel_name
			);
		}

		channel.handleClientMessage(client, message);
	}

	handleClientTopicMessage(client, message) {
		var channel_targets = message.getChannelTargets();

		if (channel_targets.length > 1) {
			throw new NotYetImplementedError('Handling when client specifies multiple channels');
		}

		var channel = this.getChannelForChannelDetails(channel_targets[0]);

		if (!channel) {
			return this.sendNoSuchChannelMessageToClientForChannelName(
				client,
				channel_targets[0].getName()
			);
		}

		channel.handleClientTopicMessage(client, message);
	}

}

extend(ChannelService.prototype, {
	type:             ServiceTypes.CHANNEL,
	channels:         null,
	channels_by_name: null
});

module.exports = ChannelService;
