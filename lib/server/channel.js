var
	extend = req('/utilities/extend'),
	has    = req('/utilities/has'),
	add    = req('/utilities/add'),
	remove = req('/utilities/remove');

var
	Channel        = req('/lib/channel'),
	MessageBuilder = req('/lib/message-builder');

var
	NotOnChannelMessage        = req('/lib/server/messages/not-on-channel'),
	BannedFromChannelMessage   = req('/lib/server/messages/banned-from-channel'),
	InviteOnlyChannelMessage   = req('/lib/server/messages/invite-only-channel'),
	ChannelTopicMessage        = req('/lib/server/messages/channel-topic'),
	ChannelNoTopicMessage      = req('/lib/server/messages/no-channel-topic'),
	ChannelTopicDetailsMessage = req('/lib/server/messages/channel-topic-details'),
	NamesReplyMessage          = req('/lib/server/messages/names-reply'),
	EndOfNamesMessage          = req('/lib/server/messages/end-of-names'),
	JoinMessage                = req('/lib/server/messages/join'),
	PartMessage                = req('/lib/server/messages/part'),
	PrivateMessage             = req('/lib/server/messages/private');



class ServerChannel extends Channel {

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
		var message = new BannedFromChannelMessage();

		message.setChannelDetails(this.getChannelDetails());

		client.sendMessage(message);
	}

	isInviteOnly() {
		return this.is_invite_only;
	}

	isClientInvited(client) {
		return has(this.invited_clients, client);
	}

	revokeClientInvitation(client) {
		remove(client).from(this.invited_clients);
	}

	handleUninvitedClient(client) {
		var message = new InviteOnlyChannelMessage();

		message.setChannelDetails(this.getChannelDetails());

		client.sendMessage(message);
	}

	isKeyProtected() {
		return this.is_key_protected;
	}

	doesKeyMatch(key) {
		return key === this.key;
	}

	isPublic() {
		return !this.isSecret() && !this.isKeyProtected();
	}

	isSecret() {
		return this.is_secret;
	}

	isFull() {
		return this.clients.length >= this.client_limit;
	}

	hasTopic() {
		return this.topic !== null;
	}

	sendTopicToClient(client) {
		if (!this.hasTopic()) {
			return this.sendNoTopicMessageToClient(client);
		}

		var topic_message =  new ChannelTopicMessage();

		topic_message.setChannelDetails(this.getChannelDetails());
		topic_message.setTopic(this.topic);

		client.sendMessage(topic_message);

		var topic_details_message = new ChannelTopicDetailsMessage();

		topic_details_message.setChannelDetails(this.getChannelDetails());
		topic_details_message.setAuthorNick(this.topic_author_nick);
		topic_details_message.setTimestamp(this.topic_timestamp);

		client.sendMessage(topic_details_message);
	}

	sendNoTopicMessageToClient(client) {
		var message = new ChannelNoTopicMessage();

		message.setChannelDetails(this.getChannelDetails());

		client.sendMessage(message);
	}

	sendNotOnChannelMessageToClient(client) {
		var message = new NotOnChannelMessage();

		message.setChannelDetails(this.getChannelDetails());

		client.sendMessage(message);
	}

	getClientNames() {
		return this.clients.map(function map(client) {
			var
				user_details = client.getUserDetails(),
				nick         = user_details.getNick(),
				prefix       = user_details.getPrefixForChannel(this);

			return prefix + nick;
		}, this);
	}

	createNamesReplyMessageForClient(client) {
		var message = new NamesReplyMessage();

		message.setChannelDetails(this.getChannelDetails());
		// Normally, the client is added as a target automatically when the
		// message is sent, but we want to add it upfront in order to ensure
		// that the character limit isn't exceeded.
		message.addTarget(client.getUserDetails());
		message.setServerDetails(client.getServerDetails());

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
		var message = new EndOfNamesMessage();

		message.setChannelDetails(this.getChannelDetails());

		client.sendMessage(message);
	}

	dispatchJoinMessagesForClient(joining_client) {
		this.clients.forEach(function each(client) {
			var message = new JoinMessage();

			message.setUserDetails(joining_client.getUserDetails());
			message.setChannelDetails(this.getChannelDetails());

			client.sendMessage(message);
		}, this);
	}

	dispatchPartMessagesForClient(parting_client) {
		this.clients.forEach(function each(client) {
			var message = new PartMessage();

			message.setUserDetails(parting_client.getUserDetails());
			message.setChannelDetails(this.getChannelDetails());

			client.sendMessage(message);
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

			var outbound_message = PrivateMessage.fromInboundMessage(message);

			current_client.sendMessage(outbound_message);
		});
	}

	handleClientTopicMessage(client, message) {
		if (!this.hasClient(client)) {
			return void this.sendNotOnChannelMessageToClient(client);
		}

		// TODO: permissions

		if (!message.hasTopic()) {
			return this.sendTopicToClient(client);
		}

		this.setTopic(message.getTopic());
		this.setTopicAuthorNick(message.getUserDetails().getNick());

		// TODO: Clean up / consolidate timestamp generation.
		this.setTopicTimestamp(Math.floor(Date.now() / 1000));
		this.clients.forEach(this.sendTopicToClient, this);
	}

}

extend(ServerChannel.prototype, {

	clients:          null,
	banned_clients:   null,
	invited_clients:  null,

	is_invite_only:   false,
	is_key_protected: false,
	key:              null,
	is_secret:        false,
	client_limit:     Infinity

});

module.exports = ServerChannel;
