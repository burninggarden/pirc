
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

	getClientForUserDetails(user_details) {
		if (user_details.hasIdentifier()) {
			let user_id = user_details.getIdentifier();

			return this.getClientForUserId(user_id);
		}

		if (user_details.hasNick()) {
			let nick = user_details.getNick();

			return this.getClientForNick(nick);
		}

		return null;
	}

	getClientsForUserDetails(user_details) {
		if (!user_details.hasMask()) {
			let client = this.getClientForUserDetails(user_details);

			if (client) {
				return [client];
			} else {
				return [ ];
			}
		}

		return this.clients.filter(function filter(client) {
			return client.getUserDetails().matches(user_details);
		});
	}

	getClientForUserId(user_id) {
		var index = 0;

		while (index < this.clients.length) {
			let client = this.clients[index];

			if (client.getUserDetails().getIdentifier() === user_id) {
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

			if (client.getUserDetails().getNick() === nick) {
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
