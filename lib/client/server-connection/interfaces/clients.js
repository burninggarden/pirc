var
	ClientRegistry = req('/lib/client/client-registry');


module.exports = {

	init() {
		this.client_registry = new ClientRegistry();
	},

	getUserRegistry() {
		return this.client_registry;
	}

};
