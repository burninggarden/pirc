
var
	extend = req('/utilities/extend');

var
	Module         = req('/lib/server/module'),
	ModuleTypes    = req('/constants/module-types'),
	MessageBuilder = req('/lib/message-builder');

var
	WelcomeMessage       = req('/lib/server/messages/welcome'),
	YourHostMessage      = req('/lib/server/messages/your-host'),
	MyInfoMessage        = req('/lib/server/messages/my-info'),
	CreatedMessage       = req('/lib/server/messages/created'),
	ISupportMessage      = req('/lib/server/messages/i-support'),
	LUserClientMessage   = req('/lib/server/messages/l-user-client'),
	LUserOpMessage       = req('/lib/server/messages/l-user-op'),
	LUserUnknownMessage  = req('/lib/server/messages/l-user-unknown'),
	LUserChannelsMessage = req('/lib/server/messages/l-user-channels'),
	LUserMeMessage       = req('/lib/server/messages/l-user-me'),
	LocalUsersMessage    = req('/lib/server/messages/local-users'),
	GlobalUsersMessage   = req('/lib/server/messages/global-users'),
	StatsConnMessage     = req('/lib/server/messages/stats-conn'),
	MotdStartMessage     = req('/lib/server/messages/motd-start'),
	MotdMessage          = req('/lib/server/messages/motd'),
	EndOfMotdMessage     = req('/lib/server/messages/end-of-motd'),
	NoMotdMessage        = req('/lib/server/messages/no-motd');

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
		this.sendLUserClientMessageToClient(client);
		this.sendLUserOpMessageToClient(client);
		this.sendLUserUnknownMessageToClient(client);
		this.sendLUserChannelsMessageToClient(client);
		this.sendLUserMeMessageToClient(client);
		this.sendLocalUsersMessageToClient(client);
		this.sendGlobalUsersMessageToClient(client);
		this.sendStatsConnMessageToClient(client);

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

	sendWelcomeMessageToClient(client) {
		this.sendMessageToClient(new WelcomeMessage(), client);
	}

	sendYourHostMessageToClient(client) {
		this.sendMessageToClient(new YourHostMessage(), client);
	}

	sendCreatedMessageToClient(client) {
		this.sendMessageToClient(new CreatedMessage(), client);
	}

	sendMyInfoMessageToClient(client) {
		this.sendMessageToClient(new MyInfoMessage(), client);
	}

	createISupportMessageForClient(client) {
		var message = new ISupportMessage();

		message.setUserDetails(client.getUserDetails());
		message.setServerDetails(this.getServerDetails());

		// NOTICE:
		// We need to explicitly set the body to an empty string
		// in order for the message builder to properly serialize
		// the server settings using the correct length limits.
		message.body = '';

		return message;
	}

	sendISupportMessagesToClient(client) {
		var messages = MessageBuilder.buildMultipleMessages(
			this.getServerDetails().serializeSettings(),
			this.createISupportMessageForClient.bind(this, client)
		);

		messages.forEach(client.sendMessage, client);
	}

	sendLUserClientMessageToClient(client) {
		this.sendMessageToClient(new LUserClientMessage(), client);
	}

	sendLUserOpMessageToClient(client) {
		this.sendMessageToClient(new LUserOpMessage(), client);
	}

	sendLUserUnknownMessageToClient(client) {
		this.sendMessageToClient(new LUserUnknownMessage(), client);
	}

	sendLUserChannelsMessageToClient(client) {
		var message = new LUserChannelsMessage();

		message.setChannelCount(this.getChannelCount());

		this.sendMessageToClient(message, client);
	}

	sendLUserMeMessageToClient(client) {
		this.sendMessageToClient(new LUserMeMessage(), client);
	}

	sendLocalUsersMessageToClient(client) {
		this.sendMessageToClient(new LocalUsersMessage(), client);
	}

	sendGlobalUsersMessageToClient(client) {
		this.sendMessageToClient(new GlobalUsersMessage(), client);
	}

	sendStatsConnMessageToClient(client) {
		this.sendMessageToClient(new StatsConnMessage(), client);
	}

	sendMessageToClient(message, client) {
		message.setUserDetails(client.getUserDetails());
		message.setServerDetails(this.getServerDetails());

		client.sendMessage(message);
	}

	sendMotdStartToClient(client) {
		this.sendMessageToClient(new MotdStartMessage(), client);
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
