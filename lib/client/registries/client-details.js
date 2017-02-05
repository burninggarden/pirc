
var
	extend = req('/utilities/extend');

class ClientDetailsRegistry {

	constructor() {
		this.client_details_by_id = { };
	}

	getClientDetailsForId(id) {
		return this.client_details_by_id[id];
	}

	setClientDetailsForId(client_details, id) {
		this.client_details_by_id[id] = client_details;
	}

	getClientDetailsForMessage(message) {
		var
			client_details = message.getClientDetails(),
			client_id      = client_details.getIdentifier();

		var cached_details = this.getClientDetailsForId(client_id);

		if (cached_details) {
			// TODO: hydrate the cached value, or vice versa?
			return cached_details;
		}

		this.setClientDetailsForId(client_details, client_id);

		return client_details;
	}

}

extend(ClientDetailsRegistry.prototype, {

	clients_by_id: null

});


module.exports = ClientDetailsRegistry;
