var req = require('req');

var
	extend                            = req('/utilities/extend'),
	AbstractMethodNotImplementedError = req('/lib/errors/abstract-method-not-implemented');

class Service {

	setServerDetails(server_details) {
		this.server_details = server_details;
		return this;
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

	server_details: null

});

module.exports = Service;
