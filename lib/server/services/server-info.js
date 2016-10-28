var
	Service = req('/lib/server/service');

var
	WelcomeMessage = req('/lib/server/messages/welcome');

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
		var message = new WelcomeMessage();

		message.setClientDetails(client.getClientDetails());
		message.setServerDetails(this.getServerDetails());

		client.sendMessage(message);
	}

	sendYourHostMessageToClient(client) {
	}

	sendCreatedMessageToClient(client) {
	}

	sendMyInfoMessageToClient(client) {
	}

	sendISupportMessageToClient(client) {
	}

}

module.exports = ServerInfoService;
