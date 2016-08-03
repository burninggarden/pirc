var req = require('req');

var
	AbstractMethodNotImplementedError = req('/lib/errors/abstract-method-not-implemented');

class Service {

	handleClientMessage() {
		throw new AbstractMethodNotImplementedError('handleClientMessage()');
	}

	registerClient() {
		throw new AbstractMethodNotImplementedError('registerClient()');
	}

	unregisterClient() {
		throw new AbstractMethodNotImplementedError('unregisterClient()');
	}

}

module.exports = Service;
