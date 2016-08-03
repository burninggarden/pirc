var req = require('req');


var
	extend  = req('/utilities/extend'),
	Service = req('/lib/server/service');

var
	NicknameInUseMessage = req('/lib/server/messages/nickname-in-use');

class NickService extends Service {

	constructor() {
		super();
		this.nicks_to_clients = { };
	}

	registerClient(client) {
		var nick = client.getNick();

		if (nick) {
			this.nicks_to_clients[nick] = client;
		}
	}

	handleClientMessage(client, message) {
		var
			nick            = message.getNick(),
			existing_client = this.nicks_to_clients[nick];

		if (existing_client === client) {
			// TODO: figure out what to do here...
			return;
		}

		if (existing_client !== undefined) {
			let response = new NicknameInUseMessage();

			response.setNick(nick);

			return void client.sendMessage(response);
		}

		client.setNick(nick);
	}

}

extend(NickService.prototype, {
	nicks_to_clients: null
});

module.exports = NickService;
