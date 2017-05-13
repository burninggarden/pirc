
var
	extend = req('/utilities/extend'),
	add    = req('/utilities/add'),
	remove = req('/utilities/remove');

class ClientConnectionRegistry {

	constructor() {
		this.client_connections = [ ];
	}

	addClientConnection(client_connection) {
		add(client_connection).to(this.client_connections);
	}

	removeClientConnection(client_connection) {
		remove(client_connection).from(this.client_connections);
	}

	getClientConnectionForUserDetails(user_details) {
		if (user_details.hasIdentifier()) {
			let user_id = user_details.getIdentifier();

			return this.getClientConnectionForUserId(user_id);
		}

		if (user_details.hasNick()) {
			let nick = user_details.getNick();

			return this.getClientConnectionForNick(nick);
		}

		return null;
	}

	getClientConnectionsForUserDetails(user_details) {
		if (!user_details.hasMask()) {
			let client = this.getClientConnectionForUserDetails(user_details);

			if (client) {
				return [client];
			} else {
				return [ ];
			}
		}

		return this.client_connections.filter(function filter(connection) {
			return connection.getUserDetails().matches(user_details);
		});
	}

	getClientConnectionForUserId(user_id) {
		var index = 0;

		while (index < this.client_connections.length) {
			let
				client_connection = this.client_connections[index],
				user_details      = client_connection.getUserDetails();

			if (user_details.getIdentifier() === user_id) {
				return client_connection;
			}

			index++;
		}

		return null;
	}

	getClientConnectionForNick(nick) {
		var index = 0;

		while (index < this.client_connections.length) {
			let client_connection = this.client_connections[index];

			if (client_connection.getUserDetails().getNick() === nick) {
				return client_connection;
			}

			index++;
		}

		return null;
	}

}

extend(ClientConnectionRegistry.prototype, {
	clients: null
});

module.exports = ClientConnectionRegistry;
