var req = require('req');

var
	extend = req('/utilities/extend');

var
	AbstractMethodNotImplementedError = req('/lib/errors/abstract-method-not-implemented'),
	ServiceDetails                    = req('/lib/service-details');

var
	NoSuchNickMessage = req('/lib/server/messages/no-such-nick');


class Service {

	setServerDetails(server_details) {
		this.server_details = server_details;
		return this;
	}

	getServerDetails() {
		return this.server_details;
	}

	getServiceDetails() {
		if (!this.service_details) {
			this.service_details = ServiceDetails.fromName(this.getName());
		}

		return this.service_details;
	}

	getName() {
		if (this.name === null) {
			throw new Error(`
				Tried to determine service name, but none was set
			`);
		}

		return this.name;
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

	getClientsForUserDetails(user_details) {
		return this.getClientRegistry().getClientsForUserDetails(user_details);
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

	sendNoSuchNickMessageToClientForUserDetails(client, user_details) {
		var message = new NoSuchNickMessage();

		message.setNick(user_details.getNick());

		client.sendMessage(message);
	}

}

extend(Service.prototype, {

	name:            null,
	server_details:  null,
	client_registry: null

});

module.exports = Service;
