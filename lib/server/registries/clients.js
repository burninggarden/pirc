
var
	extend = req('/utilities/extend'),
	add    = req('/utilities/add'),
	remove = req('/utilities/remove');

class ClientRegistry {

	constructor() {
		this.clients = [ ];
	}

	addClient(client) {
		add(client).to(this.clients);
	}

	removeClient(client) {
		remove(client).from(this.clients);
	}

	getClientForClientDetails(client_details) {
		if (client_details.hasIdentifier()) {
			let client_id = client_details.getIdentifier();

			return this.getClientForClientId(client_id);
		}

		if (client_details.hasNick()) {
			let nick = client_details.getNick();

			return this.getClientForNick(nick);
		}

		return null;
	}

	getClientForClientId(client_id) {
		var index = 0;

		while (index < this.clients.length) {
			let client = this.clients[index];

			if (client.getClientDetails().getIdentifier() === client_id) {
				return client;
			}

			index++;
		}

		return null;
	}

	getClientForNick(nick) {
		var index = 0;

		while (index < this.clients.length) {
			let client = this.clients[index];

			if (client.getClientDetails().getNick() === nick) {
				return client;
			}

			index++;
		}
	}

}

extend(ClientRegistry.prototype, {
	clients: null
});

module.exports = ClientRegistry;
