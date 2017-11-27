var
	extend              = require('../utility/extend'),
	has                 = require('../utility/has'),
	add                 = require('../utility/add'),
	remove              = require('../utility/remove'),
	getCurrentTimestamp = require('../utility/get-current-timestamp');

var
	Channel        = require('../channel'),
	MessageBuilder = require('../message-builder');

var
	Enum_ModeActions = require('../enum/mode-actions'),
	Enum_TargetTypes = require('../enum/target-types');

var
	Message_Reply_NotOnChannel             = require('../message/reply/not-on-channel'),
	Message_Reply_BannedFromChannel        = require('../message/reply/banned-from-channel'),
	Message_Reply_InviteOnlyChannel        = require('../message/reply/invite-only-channel'),
	Message_Reply_ChannelTopic             = require('../message/reply/channel-topic'),
	Message_Reply_ChannelNoTopic           = require('../message/reply/no-channel-topic'),
	Message_Reply_ChannelTopicDetails      = require('../message/reply/channel-topic-details'),
	Message_Reply_NamesReply               = require('../message/reply/names-reply'),
	Message_Reply_EndOfNames               = require('../message/reply/end-of-names'),
	Message_Reply_ChannelIsFull            = require('../message/reply/channel-is-full'),
	Message_Reply_NoChannelModes           = require('../message/reply/no-channel-modes'),
	Message_Reply_UnknownMode              = require('../message/reply/unknown-mode'),
	Message_Reply_OperatorPrivilegesNeeded = require('../message/reply/channel-operator-privileges-needed');

var
	Message_Command_Join    = require('../message/command/join'),
	Message_Command_Mode    = require('../message/command/mode'),
	Message_Command_Part    = require('../message/command/part'),
	Message_Command_Private = require('../message/command/private');



class Server_Channel extends Channel {

	constructor(name) {
		super(name);

		this.clients         = [ ];
		this.banned_clients  = [ ];
		this.invited_clients = [ ];
	}

	isClientBanned(client) {
		return has(this.banned_clients, client);
	}

	handleBannedClient(client) {
		var message = new Message_Reply_BannedFromChannel();

		message.setChannelName(this.getName());

		client.sendMessage(message);
	}

	isInviteOnly() {
		return this.getChannelDetails().isInviteOnly();
	}

	isClientInvited(client) {
		return has(this.invited_clients, client);
	}

	revokeClientInvitation(client) {
		remove(client).from(this.invited_clients);
	}

	handleUninvitedClient(client) {
		var message = new Message_Reply_InviteOnlyChannel();

		message.setChannelName(this.getName());

		client.sendMessage(message);
	}

	isKeyProtected() {
		return this.getChannelDetails().isKeyProtected();
	}

	doesKeyMatch(key) {
		return key === this.getChannelDetails().getKey();
	}

	isPublic() {
		return !this.isSecret() && !this.isKeyProtected();
	}

	isSecret() {
		return this.getChannelDetails().isSecret();
	}

	allowsModes() {
		return this.getChannelDetails().allowsModes();
	}

	isFull() {
		var channel_details = this.getChannelDetails();

		if (!channel_details.hasLimit()) {
			return false;
		}

		var limit = channel_details.getLimit();

		return this.clients.length >= limit;
	}

	hasTopic() {
		return this.topic !== null;
	}

	sendTopicToClient(client) {
		if (!this.hasTopic()) {
			return this.sendNoTopicMessageToClient(client);
		}

		var topic_message =  new Message_Reply_ChannelTopic();

		topic_message.setChannelName(this.getName());
		topic_message.setChannelTopic(this.topic);

		client.sendMessage(topic_message);

		var topic_details_message = new Message_Reply_ChannelTopicDetails();

		topic_details_message.setChannelName(this.getName());
		topic_details_message.setAuthorUserId(this.getTopicAuthorUserId());
		topic_details_message.setTimestamp(this.getTopicTimestamp());

		client.sendMessage(topic_details_message);
	}

	sendNoTopicMessageToClient(client) {
		var message = new Message_Reply_ChannelNoTopic();

		message.setChannelName(this.getName());

		client.sendMessage(message);
	}

	sendNotOnChannelMessageToClient(client) {
		var message = new Message_Reply_NotOnChannel();

		message.setChannelName(this.getName());

		client.sendMessage(message);
	}

	getClientNames() {
		return this.clients.map(function map(client) {
			var
				user_details = client.getUserDetails(),
				nickname     = user_details.getNickname(),
				prefix       = user_details.getPrefixForChannel(this);

			return prefix + nickname;
		}, this);
	}

	getPrivacySignifier() {
		return this.getChannelDetails().getPrivacySignifier();
	}

	createNamesReplyMessageForClient(client) {
		var message = new Message_Reply_NamesReply();

		message.setChannelName(this.getName());
		message.setOriginHostname(this.getHostname());
		message.setChannelPrivacySignifier(this.getPrivacySignifier());

		// Normally, the client is added as a target automatically when the
		// message is sent, but we want to add it upfront in order to ensure
		// that the character limit isn't exceeded.
		message.setTarget(client.getNickname());

		return message;
	}

	sendNamesToClient(client) {
		var
			names = this.getClientNames(),
			body  = names.join(' ');

		var messages = MessageBuilder.buildMultipleMessages(
			body,
			this.createNamesReplyMessageForClient.bind(this, client)
		);

		messages.forEach(client.sendMessage, client);

		this.sendEndOfNamesMessageToClient(client);
	}

	sendEndOfNamesMessageToClient(client) {
		var message = new Message_Reply_EndOfNames();

		message.setChannelName(this.getName());

		client.sendMessage(message);
	}

	dispatchJoinMessagesForClient(joining_client) {
		this.clients.forEach(function each(client) {
			var message = new Message_Command_Join();

			message.setOriginUserId(joining_client.getUserId());
			message.addChannelName(this.getName());

			client.sendMessage(message);
		}, this);
	}

	dispatchPartMessagesForClient(parting_client) {
		this.clients.forEach(function each(client) {
			var message = new Message_Command_Part();

			message.setOriginUserId(parting_client.getUserId());
			message.addChannelName(this.getName());

			client.sendMessageIfConnected(message);
		}, this);
	}

	addClient(client, key) {
		if (this.hasClient(client)) {
			// Er... The spec is actually not clear on what should happen
			// in this specific case. Maybe we should return ERR_USERONCHANNEL?
			return;
		}

		if (this.isClientBanned(client)) {
			return void this.handleBannedClient(client);
		}

		if (this.isInviteOnly() && !this.isClientInvited(client)) {
			return void this.handleUninvitedClient(client);
		}

		if (this.isKeyProtected() && !this.doesKeyMatch(key)) {
			this.handleClientWithBadKey(client);
		}

		if (this.isFull()) {
			return void this.handleExcessClient(client);
		}

		// TODO: BADCHANMASK

		add(client).to(this.clients);

		var
			user_details = client.getUserDetails(),
			channel_name = this.getName();

		user_details.addChannelName(channel_name);

		// If the user is the first to join this channel,
		// flag them as the channel operator:
		if (this.clients.length === 1) {
			user_details.setIsOperatorForChannelName(channel_name, true);
		}

		this.dispatchJoinMessagesForClient(client);

		if (this.hasTopic()) {
			this.sendTopicToClient(client);
		}

		this.sendNamesToClient(client);

		if (this.isClientInvited(client)) {
			this.revokeClientInvitation(client);
		}
	}

	removeClient(client) {
		if (!this.hasClient(client)) {
			return void this.sendNotOnChannelMessageToClient(client);
		}

		this.dispatchPartMessagesForClient(client);

		remove(client).from(this.clients);
		client.getUserDetails().removeChannelName(this.getName());
	}

	hasClient(client) {
		return has(this.clients, client);
	}

	isEmpty() {
		return this.clients.length === 0;
	}

	/**
	 * Allows hard-coding the list of clients for a specific channel.
	 * This is used for one-off channels, where we really just need
	 * to tap into this class's logic for a group of users at a fixed point
	 * in time.
	 *
	 * @param   {ClientConnection[]} clients
	 * @returns {self}
	 */
	setClients(clients) {
		this.clients = clients;
		return this;
	}

	handleClientMessage(client, message) {
		// TODO: permissions

		this.clients.forEach(function each(current_client) {
			if (client === current_client) {
				return;
			}

			var outgoing_message = new Message_Command_Private();

			outgoing_message.setOriginUserId(client.getUserId());
			outgoing_message.setMessageBody(message.getMessageBody());
			outgoing_message.setTarget(this.getName());

			current_client.sendMessage(outgoing_message);
		}, this);
	}

	handleClientTopicMessage(client, message) {
		if (!this.hasClient(client)) {
			return void this.sendNotOnChannelMessageToClient(client);
		}

		// TODO: permissions

		if (!message.hasChannelTopic()) {
			return this.sendTopicToClient(client);
		}

		this.setTopic(message.getChannelTopic());

		var user_id = message.getOriginUserId();

		this.setTopicAuthorUserId(user_id);

		this.setTopicTimestamp(getCurrentTimestamp());

		this.clients.forEach(function each(target_client) {
			target_client.sendMessage(message);
		}, this);
	}

	handleClientModeMessage(client, message) {
		if (!this.allowsModes()) {
			return void this.sendModesNotAllowedMessageToClient(client);
		}

		var
			mode_changes       = message.getModeChanges(),
			successful_changes = [ ];

		mode_changes.forEach(function each(mode_change) {
			var was_successful = this.handleClientModeChange(
				client,
				mode_change
			);

			if (was_successful) {
				successful_changes.push(mode_change);
			}
		}, this);

		if (successful_changes.length > 0) {
			this.dispatchModeMessageForClientModeChanges(
				client,
				successful_changes
			);
		}
	}

	dispatchModeMessageForClientModeChanges(changing_client, mode_changes) {
		this.clients.forEach(function each(client) {
			var message = new Message_Command_Mode();

			message.setOriginUserId(changing_client.getUserId());
			message.setTargetType(Enum_TargetTypes.CHANNEL);
			message.setChannelName(this.getName());

			mode_changes.forEach(function each(mode_change) {
				message.addModeChange(mode_change);
			});

			client.sendMessage(message);
		}, this);
	}

	sendModesNotAllowedMessageToClient(client) {
		var message = new Message_Reply_NoChannelModes();

		message.setChannelName(this.getName());

		client.sendMessage(message);
	}

	handleClientModeChange(client, mode_change) {
		var
			mode           = mode_change.getMode(),
			server_details = this.getServerDetails();

		if (
			   !server_details.hasChannelMode(mode)
			&& !server_details.hasChannelUserMode(mode)
		) {
			this.sendUnknownModeMessageToClientForModeChange(
				client,
				mode_change
			);

			return false;
		}

		try {
			mode_change.validate();
		} catch (error) {
			this.handleClientModeChangeError(client, error);
			return false;
		}

		if (!this.clientHasPermissionToSetMode(client, mode)) {
			this.sendOperatorPrivilegesNeededMessageToClientForModeChange(
				client,
				mode_change
			);
			return false;
		}

		var
			channel_details = this.getChannelDetails(),
			action          = mode_change.getAction();

		switch (action) {
			case Enum_ModeActions.ADD:
				return channel_details.applyAdditionModeChange(mode_change);

			case Enum_ModeActions.REMOVE:
				return channel_details.applyRemovalModeChange(mode_change);

			default:
				throw new Error('Invalid mode action: ' + mode);
		}
	}

	handleClientModeChangeError(client, error) {
		throw error;
	}

	sendOperatorPrivilegesNeededMessageToClientForModeChange(client, mode_change) {
		var message = new Message_Reply_OperatorPrivilegesNeeded();

		message.setChannelName(this.getName());

		client.sendMessage(message);
	}

	clientHasPermissionToSetMode(client, mode) {
		return client.getUserDetails().isOperatorForChannel(this);
	}

	sendUnknownModeMessageToClientForModeChange(client, mode_change) {
		var message = new Message_Reply_UnknownMode();

		message.setMode(mode_change.getMode());
		message.setChannelName(this.getName());

		client.sendMessage(message);
	}

	handleExcessClient(client) {
		var message = new Message_Reply_ChannelIsFull();

		message.setChannelName(this.getName());

		client.sendMessage(message);
	}

	getObserversForClient(client) {
		if (!this.hasClient(client)) {
			return [ ];
		}

		// TODO: More fine-grained logic here; ie, determine when the
		// user is invisible to other clients based on modes etc.
		return this.clients.slice(0);
	}

	setServerDetails(server_details) {
		this.server_details = server_details;
	}

	getServerDetails() {
		return this.server_details;
	}

	getHostname() {
		return this.getServerDetails().getHostname();
	}

	destroy() {
		super.destroy();

		this.clients         = null;
		this.banned_clients  = null;
		this.invited_clients = null;
		this.server_details  = null;
	}

}

extend(Server_Channel.prototype, {

	clients:         null,
	banned_clients:  null,
	invited_clients: null,
	key:             null,
	server_details:  null

});

module.exports = Server_Channel;
