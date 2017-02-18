var
	extend       = req('/utilities/extend'),
	Service      = req('/lib/server/service'),
	Commands     = req('/constants/commands'),
	ServiceTypes = req('/constants/service-types');

var
	NickInUseMessage = req('/lib/server/messages/nick-in-use');

class NickService extends Service {

	constructor() {
		super();
		this.nicks_to_clients = { };
	}

	coupleToClient(client) {
		var user_details = client.getUserDetails();

		if (user_details.hasNick()) {
			this.nicks_to_clients[user_details.getNick()] = client;
		}
	}

	decoupleFromClient(client) {
		var user_details = client.getUserDetails();

		if (user_details.hasNick()) {
			delete this.nicks_to_clients[user_details.getNick()];
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
			let response = new NickInUseMessage(nick);

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
	type:             ServiceTypes.NICK,
	nicks_to_clients: null
});

module.exports = NickService;
