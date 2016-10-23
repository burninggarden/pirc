
var
	extend = req('/utilities/extend');

class ClientRegistry {

	constructor() {
		this.clients_by_id = { };
	}

	getClientForMessage(message) {
		var
			client_details = message.getClientDetails(),
			client_id      = client_details.getIdentifier();

		if (!this.clients_by_id[client_id]) {
			this.clients_by_id[client_id] = client_details;
		}

		return this.clients_by_id[client_id];
	}

}

extend(ClientRegistry.prototype, {

	clients_by_id: null

});


module.exports = ClientRegistry;
