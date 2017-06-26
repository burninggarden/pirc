
var
	extend = req('/lib/utilities/extend');

var
	Module         = req('/lib/server/module'),
	ModuleTypes    = req('/lib/constants/module-types'),
	MessageBuilder = req('/lib/message-builder');

var
	WelcomeMessage       = req('/lib/messages/replies/welcome'),
	YourHostMessage      = req('/lib/messages/replies/your-host'),
	MyInfoMessage        = req('/lib/messages/replies/my-info'),
	CreatedMessage       = req('/lib/messages/replies/created'),
	ISupportMessage      = req('/lib/messages/replies/i-support'),
	LUserClientMessage   = req('/lib/messages/replies/l-user-client'),
	LUserOpMessage       = req('/lib/messages/replies/l-user-op'),
	LUserUnknownMessage  = req('/lib/messages/replies/l-user-unknown'),
	LUserChannelsMessage = req('/lib/messages/replies/l-user-channels'),
	LUserMeMessage       = req('/lib/messages/replies/l-user-me'),
	LocalUsersMessage    = req('/lib/messages/replies/local-users'),
	GlobalUsersMessage   = req('/lib/messages/replies/global-users'),
	StatsDLineMessage    = req('/lib/messages/replies/stats-dline'),
	MotdStartMessage     = req('/lib/messages/replies/motd-start'),
	MotdMessage          = req('/lib/messages/replies/motd'),
	EndOfMotdMessage     = req('/lib/messages/replies/end-of-motd'),
	NoMotdMessage        = req('/lib/messages/replies/no-motd');


class ServerInfoModule extends Module {

	hasMotd() {
		return this.getServerDetails().hasMotd();
	}

	getMotd() {
		return this.getServerDetails().getMotd();
	}

	setMotd(motd) {
		this.getServerDetails().setMotd(motd);
	}

	coupleToClient(client) {
		this.sendWelcomeMessageToClient(client);
		this.sendYourHostMessageToClient(client);
		this.sendCreatedMessageToClient(client);
		this.sendMyInfoMessageToClient(client);
		this.sendISupportMessagesToClient(client);
		this.sendLUserMessagesToClient(client);
		this.sendLocalUsersMessageToClient(client);
		this.sendGlobalUsersMessageToClient(client);
		this.sendStatsDLineMessageToClient(client);

		if (!this.hasMotd()) {
			this.sendMotdMissingErrorToClient(client);
		} else {
			this.sendMotdStartToClient(client);
			this.sendMotdToClient(client);
			this.sendMotdEndToClient(client);
		}
	}

	decoupleFromClient() {
		// Deliberately a noop.
	}

	getChannelCount() {
		return this.getServerDetails().getChannelCount();
	}

	hasChannels() {
		return this.getServerDetails().hasChannels();
	}

	getGlobalUserCount() {
		return this.getServerDetails().getGlobalUserCount();
	}

	getMaxGlobalUserCount() {
		return this.getServerDetails().getMaxGlobalUserCount();
	}

	getClientCount() {
		return this.getServerDetails().getClientCount();
	}

	getUserCount() {
		return this.getServerDetails().getUserCount();
	}

	getMaxUserCount() {
		return this.getServerDetails().getMaxUserCount();
	}

	getGlobalServiceCount() {
		return this.getServerDetails().getGlobalServiceCount();
	}

	getServerCount() {
		return this.getServerDetails().getServerCount();
	}

	hasOperators() {
		return this.getServerDetails().hasOperators();
	}

	getOperatorCount() {
		return this.getServerDetails().getOperatorCount();
	}

	hasUnknownConnections() {
		return this.getServerDetails().hasUnknownConnections();
	}

	getUnknownConnectionCount() {
		return this.getServerDetails().getUnknownConnectionCount();
	}

	getMaxConnectionCount() {
		return this.getServerDetails().getMaxConnectionCount();
	}

	getTotalConnectionCount() {
		return this.getServerDetails().getTotalConnectionCount();
	}

	getMaxClientCount() {
		return this.getServerDetails().getMaxClientCount();
	}

	sendWelcomeMessageToClient(client) {
		var message = (new WelcomeMessage())
			.setUserId(client.getUserIdentifier());

		this.sendMessageToClient(message, client);
	}

	sendYourHostMessageToClient(client) {
		var
			message        = new YourHostMessage(),
			server_details = this.getServerDetails();

		message.setHostname(server_details.getHostname());
		message.setServerVersion(server_details.getVersion());

		this.sendMessageToClient(message, client);
	}

	sendCreatedMessageToClient(client) {
		var message = new CreatedMessage();

		message.setTimestamp(this.getServerDetails().getCreatedTimestamp());

		this.sendMessageToClient(message, client);
	}

	sendMyInfoMessageToClient(client) {
		var
			message        = new MyInfoMessage(),
			server_details = this.getServerDetails();

		message.setHostname(server_details.getHostname());
		message.setServerVersion(server_details.getVersion());
		message.setUserModes(server_details.getUserModes());
		message.setChannelModes(server_details.getChannelModes());

		this.sendMessageToClient(message, client);
	}

	sendLUserMessagesToClient(client) {
		this.sendLUserClientMessageToClient(client);

		// The following LUSERS reply messages are only sent if non-zero
		// values are found for the counts that they embody:
		if (this.hasOperators()) {
			this.sendLUserOpMessageToClient(client);
		}

		if (this.hasUnknownConnections()) {
			this.sendLUserUnknownMessageToClient(client);
		}

		if (this.hasChannels()) {
			this.sendLUserChannelsMessageToClient(client);
		}

		this.sendLUserMeMessageToClient(client);
	}

	createISupportMessageForClient(client) {
		var message = new ISupportMessage();

		message.setOriginServerDetails(this.getServerDetails());
		message.addTarget(client.getUserDetails());

		return message;
	}

	sendISupportMessagesToClient(client) {
		var messages = MessageBuilder.buildMessagesFromWords(
			this.getServerDetails().serializeSettings(),
			this.createISupportMessageForClient.bind(this, client)
		);

		messages.forEach(client.sendMessage, client);
	}

	sendLUserClientMessageToClient(client) {
		var message = (new LUserClientMessage())
			.setUserCount(this.getGlobalUserCount())
			.setServiceCount(this.getGlobalServiceCount())
			.setServerCount(this.getServerCount());

		this.sendMessageToClient(message, client);
	}

	sendLUserOpMessageToClient(client) {
		var message = (new LUserOpMessage())
			.setOperatorCount(this.getOperatorCount());

		this.sendMessageToClient(message, client);
	}

	sendLUserUnknownMessageToClient(client) {
		var message = (new LUserUnknownMessage())
			.setUnknownUserCount(this.getUnknownUserCount());

		this.sendMessageToClient(message, client);
	}

	sendLUserChannelsMessageToClient(client) {
		var message = (new LUserChannelsMessage())
			.setChannelCount(this.getChannelCount());

		this.sendMessageToClient(message, client);
	}

	sendLUserMeMessageToClient(client) {
		var message = (new LUserMeMessage())
			.setClientCount(this.getClientCount())
			.setServerCount(this.getServerCount());

		this.sendMessageToClient(message, client);
	}

	sendLocalUsersMessageToClient(client) {
		var message = (new LocalUsersMessage())
			.setUserCount(this.getUserCount())
			.setMaxUserCount(this.getMaxUserCount());

		this.sendMessageToClient(message, client);
	}

	sendGlobalUsersMessageToClient(client) {
		var message = (new GlobalUsersMessage())
			.setUserCount(this.getGlobalUserCount())
			.setMaxUserCount(this.getMaxGlobalUserCount());

		this.sendMessageToClient(message, client);
	}

	sendStatsDLineMessageToClient(client) {
		var message = (new StatsDLineMessage())
			.setMaxConnectionCount(this.getMaxConnectionCount())
			.setTotalConnectionCount(this.getTotalConnectionCount())
			.setMaxClientCount(this.getMaxClientCount());

		this.sendMessageToClient(message, client);
	}

	sendMessageToClient(message, client) {
		message.addTarget(client.getUserDetails());

		client.sendMessage(message);
	}

	sendMotdStartToClient(client) {
		var
			message        = new MotdStartMessage(),
			server_details = this.getServerDetails();

		message.setHostname(server_details.getHostname());

		this.sendMessageToClient(message, client);
	}

	sendMotdToClient(client) {
		var lines = this.getMotd().split('\n');

		lines.forEach(function each(line) {
			this.sendMotdLineToClient(line, client);
		}, this);
	}

	sendMotdLineToClient(line, client) {
		// Per the RFC, each line should be less than or equal to 80 characters
		// in length. If we receive one that's longer, split it into two
		// separate lines, instead.
		//
		// TODO: Split intelligently on nearest space, if one exists.
		if (line.length > 80) {
			this.sendMotdLineToClient(line.slice(0, 80), client);
			this.sendMotdLineToClient(line.slice(80),    client);
			return;
		}

		var message = new MotdMessage();

		message.setText(line);

		client.sendMessage(message);
	}

	sendMotdEndToClient(client) {
		this.sendMessageToClient(new EndOfMotdMessage(), client);
	}

	sendMotdMissingErrorToClient(client) {
		this.sendMessageToClient(new NoMotdMessage(), client);
	}

}

extend(ServerInfoModule.prototype, {

	type: ModuleTypes.SERVER_INFO

});

module.exports = ServerInfoModule;
