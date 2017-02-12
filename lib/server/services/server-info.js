var
	Service = req('/lib/server/service');

var
	WelcomeMessage  = req('/lib/server/messages/welcome'),
	YourHostMessage = req('/lib/server/messages/your-host'),
	MyInfoMessage   = req('/lib/server/messages/my-info'),
	CreatedMessage  = req('/lib/server/messages/created'),
	ISupportMessage = req('/lib/server/messages/i-support');

class ServerInfoService extends Service {

	registerClient(client) {
		this.sendWelcomeMessageToClient(client);
		this.sendYourHostMessageToClient(client);
		this.sendCreatedMessageToClient(client);
		this.sendMyInfoMessageToClient(client);
		this.sendISupportMessageToClient(client);
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

	sendMessageToClient(message, client) {
		message.setUserDetails(client.getUserDetails());
		message.setServerDetails(this.getServerDetails());

		client.sendMessage(message);
	}

}

module.exports = ServerInfoService;
