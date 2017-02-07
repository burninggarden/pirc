var req = require('req');

var
	extend = req('/utilities/extend');

var
	AbstractMethodNotImplementedError = req('/lib/errors/abstract-method-not-implemented');

class Service {

	setServerDetails(server_details) {
		this.server_details = server_details;
		return this;
	}

	getServerDetails() {
		return this.server_details;
	}

	setClientRegistry(client_registry) {
		this.client_registry = client_registry;
	}

	getClientRegistry() {
		return this.client_registry;
	}

	getClientForUserDetails(user_details) {
		return this.getClientRegistry().getClientForUserDetails(user_details);
	}

	handleClientMessage() {
		throw new AbstractMethodNotImplementedError('handleClientMessage()');
	}

	registerClient() {
		throw new AbstractMethodNotImplementedError('registerClient()');
	}

	unregisterClient() {
		throw new AbstractMethodNotImplementedError('unregisterClient()');
	}

	destroy() {
		// Noop by default.
	}

}

extend(Service.prototype, {

	server_details:  null,
	client_registry: null

});

module.exports = Service;
