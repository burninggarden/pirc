var
	extend = req('/utilities/extend'),
	has    = req('/utilities/has'),
	add    = req('/utilities/add'),
	remove = req('/utilities/remove');

var
	Channel = req('/lib/channel');

var
	NotOnChannelMessage        = req('/lib/server/messages/not-on-channel'),
	BannedFromChannelMessage   = req('/lib/server/messages/banned-from-channel'),
	InviteOnlyChannelMessage   = req('/lib/server/messages/invite-only-channel'),
	ChannelTopicMessage        = req('/lib/server/messages/channel-topic'),
	ChannelTopicDetailsMessage = req('/lib/server/messages/channel-topic-details'),
	NamesReplyMessage          = req('/lib/server/messages/names-reply'),
	EndOfNamesMessage          = req('/lib/server/messages/end-of-names'),
	JoinMessage                = req('/lib/server/messages/join'),
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

		message.setChannelName(this.name);

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

		message.setChannelName(this.name);

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
		var message =  new ChannelTopicMessage();

		message.setChannelName(this.name);
		message.setBody(this.topic);

		client.sendMessage(message);
	}

	sendTopicAuthorAndTimeToClient(client) {
		var message = new ChannelTopicDetailsMessage();

		message.setChannelName(this.name);
		message.setAuthorNick(this.topic_author_nick);
		message.setTimestamp(this.topic_timestamp);

		client.sendMessage(message);
	}

	getClientNames() {
		return this.clients.map(function map(client) {
			return client.getNick();
		});
	}

	createNamesReplyMessageForClient(client) {
		var message = new NamesReplyMessage();

		message.setChannelName(this.name);
		// Normally, the client is added as a target automatically when the
		// message is sent, but we want to add it upfront in order to ensure
		// that the character limit isn't exceeded.
		message.addTarget(client.toTarget());
		message.setServerName(client.getServerName());

		if (this.isPublic()) {
			message.setChannelIsPublic(true);
		} else if (this.isSecret()) {
			message.setChannelIsSecret(true);
		}

		return message;
	}

	sendNamesToClient(client) {
		var
			names   = this.getClientNames(),
			message = this.createNamesReplyMessageForClient(client),
			index   = 0;

		while (index < names.length) {
			let name = names[index];

			if (!message.canAddTextToBody(name)) {
				client.sendMessage(message);
				message = this.getNamesReplyMessageForClient(client);
			}

			message.addName(name);
			index++;
		}

		// Send the straggler:
		client.sendMessage(message);

		this.sendEndOfNamesMessageToClient(client);
	}

	sendEndOfNamesMessageToClient(client) {
		var message = new EndOfNamesMessage();

		message.setChannelName(this.name);

		client.sendMessage(message);
	}

	dispatchJoinMessagesForClient(joining_client) {
		this.clients.forEach(function each(client) {
			if (client === joining_client) {
				// We don't have to send a message to the client
				// who's doing the joining.
				return;
			}

			var message = new JoinMessage();

			message.setNick(joining_client.getNick());
			message.setUsername(joining_client.getUsername());
			message.setHostname(joining_client.getHostname());
			message.setChannelName(this.getName());

			client.sendMessage(message);
		}, this);
	}

	addClient(client, key) {
		if (has(this.clients, client)) {
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

		this.dispatchJoinMessagesForClient(client);

		if (this.hasTopic()) {
			this.sendTopicToClient(client);
			this.sendTopicAuthorAndTimeToClient(client);
		}

		this.sendNamesToClient(client);

		if (this.isClientInvited(client)) {
			this.revokeClientInvitation(client);
		}
	}

	removeClient(client) {
		if (!has(this.clients, client)) {
			let message = new NotOnChannelMessage();

			message.setChannelName(this.name);

			return void client.sendMessage(message);
		}

		throw new Error('implement');
	}

	/**
	 * Allows hard-coding the list of clients for a specific channel.
	 * This is used for one-off channels, where we really just need
	 * to tap into this class's logic for a group of users at a fixed point
	 * in time.
	 *
	 * @param {ClientConnection[]} clients
	 * @returns {self}
	 */
	setClients(clients) {
		this.clients = clients;
		return this;
	}

	handleClientMessage(client, message) {
		// TODO: permissions

		this.clients.forEach(function each(client) {
			var outbound_message = PrivateMessage.fromInboundMessage(message);

			client.sendMessage(outbound_message);
		});
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
	client_limit:     50

});

module.exports = ServerChannel;
