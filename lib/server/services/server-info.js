var
	Service = req('/lib/server/service');

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
	StatsConnMessage     = req('/lib/server/messages/stats-conn');

class ServerInfoService extends Service {

	registerClient(client) {
		this.sendWelcomeMessageToClient(client);
		this.sendYourHostMessageToClient(client);
		this.sendCreatedMessageToClient(client);
		this.sendMyInfoMessageToClient(client);
		this.sendISupportMessageToClient(client);
		this.sendLUserClientMessageToClient(client);
		this.sendLUserOpMessageToClient(client);
		this.sendLUserUnknownMessageToClient(client);
		this.sendLUserChannelsMessageToClient(client);
		this.sendLUserMeMessageToClient(client);
		this.sendLocalUsersMessageToClient(client);
		this.sendGlobalUsersMessageToClient(client);
		this.sendStatsConnMessageToClient(client);
	}

	unregisterClient() {
		// Deliberately a noop.
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

	sendISupportMessageToClient(client) {
		this.sendMessageToClient(new ISupportMessage(), client);
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
		this.sendMessageToClient(new LUserChannelsMessage(), client);
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

}

module.exports = ServerInfoService;
