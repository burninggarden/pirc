var req = require('req');

var
	AbstractMethodNotImplementedError = req('/lib/errors/abstract-method-not-implemented');

class Service {

	handleClientMessage() {
		throw new AbstractMethodNotImplementedError('handleClientMessage()');
	}

}

module.exports = Service;
