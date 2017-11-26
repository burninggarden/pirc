
var
	extend = require('../../utility/extend'),
	add    = require('../../utility/add'),
	remove = require('../../utility/remove');

class Server_Registry_Clients {

	/**
	 * @returns {Server_Connection_Client[]}
	 */
	getClients() {
		if (!this.clients) {
			this.clients = [ ];
		}

		return this.clients;
	}

	addClient(client) {
		add(client).to(this.getClients());
	}

	removeClient(client) {
		remove(client).from(this.getClients());
	}

	getClientForUserDetails(user_details) {
		if (user_details.hasUserId()) {
			let user_id = user_details.getUserId();

			return this.getClientForUserId(user_id);
		}

		if (user_details.hasNickname()) {
			let nickname = user_details.getNickname();

			return this.getClientForNickname(nickname);
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

		return this.getClients().filter(function filter(client) {
			return client.getUserDetails().matches(user_details);
		});
	}

	getClientForUserId(user_id) {
		var
			clients = this.getClients(),
			index   = 0;

		while (index < clients.length) {
			let client = clients[index];

			if (client.getUserDetails().getUserId() === user_id) {
				return client;
			}

			index++;
		}

		return null;
	}

	getClientForNickname(nickname) {
		var
			clients = this.getClients(),
			index   = 0;

		while (index < clients.length) {
			let client = clients[index];

			if (client.getUserDetails().getNickname() === nickname) {
				return client;
			}

			index++;
		}
	}

}

extend(Server_Registry_Clients.prototype, {
	clients: null
});

module.exports = Server_Registry_Clients;
