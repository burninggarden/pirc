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
	EndOfNamesMessage          = req('/lib/server/messages/end-of-names');



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

	getNamesReplyMessageForClient(client) {
		var message = new NamesReplyMessage();

		message.setChannelName(this.name);
		message.setServerName(client.getServerName());

		return message;
	}

	sendNamesToClient(client) {
		var
			names   = this.getClientNames(),
			message = this.getNamesReplyMessageForClient(client),
			index   = 0;

		while(index < names.length) {
			let name = names[index];

			message.addName(name);

			if (message.isAtCharacterLimit()) {
				message.removeName(name);
				client.sendMessage(message);
				message = this.getNamesReplyMessage();
			} else {
				index++;
			}
		}

		client.sendMessage(message);

		this.sendEndOfNamesMessageToClient(client);
	}

	sendEndOfNamesMessageToClient(client) {
		var message = new EndOfNamesMessage();

		message.setChannelName(this.name);

		client.sendMessage(message);
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


	}

}

extend(ServerChannel.prototype, {

	clients:          null,
	banned_clients:   null,
	invited_clients:  null,

	is_invite_only:   false,
	is_key_protected: false,
	key:              null,
	client_limit:     50

});

module.exports = ServerChannel;
