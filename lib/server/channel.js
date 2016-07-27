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



const NAMES_REPLY_LENGTH_LIMIT = 410;



class ServerChannel extends Channel {

	constructor(name) {
		super(name);

		this.clients         = [ ];
		this.banned_clients  = [ ];
		this.invited_clients = [ ];

		this.topic = Math.random().toString(16).slice(3);
	}

	isClientBanned(client) {
		return has(this.banned_clients, client);
	}

	handleBannedClient(client) {
		var message = new BannedFromChannelMessage(this.name);

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
		var message = new InviteOnlyChannelMessage(this.name);

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
		var message =  new ChannelTopicMessage(this.name, this.topic);

		client.sendMessage(message);
	}

	sendTopicAuthorAndTimeToClient(client) {
		var message = new ChannelTopicDetailsMessage(
			this.name,
			this.topic_author_nick + ' ' + this.topic_timestamp
		);

		client.sendMessage(message);
	}

	sendNamesReplyMessageToClient(names_chunk, client) {
		var message = new NamesReplyMessage(this.name, names_chunk);

		client.sendMessage(message);
	}

	getClientNames() {
		return this.clients.map(function map(client) {
			return client.getNick();
		});
	}

	sendEndOfNamesMessageToClient(client) {
		var message = new EndOfNamesMessage(this.name);

		client.sendMessage(message);
	}

	sendNamesToClient(client) {
		var
			names         = this.getClientNames(),
			chunks        = [ ],
			current_chunk = '';

		names.forEach(function each(name) {
			current_chunk += name + ' ';

			if (current_chunk.length >= NAMES_REPLY_LENGTH_LIMIT) {

				// Trim off the extraneous trailing space:
				current_chunk = current_chunk.slice(0, -1);
				chunks.push(current_chunk);

				current_chunk = '';
			}
		});

		// Trim off the extraneous trailing space:
		current_chunk = current_chunk.slice(0, -1);
		chunks.push(current_chunk);

		chunks.forEach(function each(chunk) {
			this.sendNamesReplyMessageToClient(chunk, client);
		}, this);

		this.sendEndOfNamesMessageToClient(client);
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

			return void client.sendMessage(message);
		}


	}

}

extend(ServerChannel.prototype, {

	clients:           null,
	banned_clients:    null,
	invited_clients:   null,

	is_invite_only:    false,
	is_key_protected:  false,
	key:               null,
	client_limit:      50,
	topic:             null,
	topic_author_nick: null,
	topic_timestamp:   null

});

module.exports = ServerChannel;
