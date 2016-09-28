var req = require('req');

var
	extend                            = req('/utilities/extend'),
	AbstractMethodNotImplementedError = req('/lib/errors/abstract-method-not-implemented'),
	ServerNameValidator               = req('/validators/server-name');

class Service {

	setServerName(server_name) {
		this.validateServerName(server_name);
		this.server_name = server_name;
		return this;
	}

	getServerName() {
		this.validateServerName(this.server_name);
		return this.server_name;
	}

	validateServerName(server_name) {
		ServerNameValidator.validate(server_name);
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

}

extend(Service.prototype, {

	server_name: null

});

module.exports = Service;
