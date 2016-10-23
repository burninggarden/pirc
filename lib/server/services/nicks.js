var
	extend   = req('/utilities/extend'),
	Service  = req('/lib/server/service'),
	Commands = req('/constants/commands');

var
	NicknameInUseMessage = req('/lib/server/messages/nickname-in-use');

class NickService extends Service {

	constructor() {
		super();
		this.nicks_to_clients = { };
	}

	registerClient(client) {
		var client_details = client.getClientDetails();

		if (client_details.hasNick()) {
			this.nicks_to_clients[client_details.getNick()] = client;
		}
	}

	unregisterClient(client) {
		var nick = client.getNick();

		if (nick) {
			delete this.nicks_to_clients[nick];
		}
	}

	handleClientNickMessage(client, message) {
		var
			nick            = message.getDesiredNick(),
			existing_client = this.nicks_to_clients[nick];

		if (existing_client === client) {
			// TODO: figure out what to do here...
			return;
		}

		if (existing_client !== undefined) {
			let response = new NicknameInUseMessage(nick);

			return void client.sendMessage(response);
		}

		client.setNick(nick);
	}

	handleClientMessage(client, message) {
		var command = message.getCommand();

		switch (command) {
			case Commands.NICK:
				return this.handleClientNickMessage(client, message);

			default:
				throw new Error(`Invalid command: ${command}`);
		}
	}

}

extend(NickService.prototype, {
	nicks_to_clients: null
});

module.exports = NickService;
