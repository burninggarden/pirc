
var
	extend = req('/utilities/extend'),
	has    = req('/utilities/has'),
	defer  = req('/utilities/defer');

var
	AbstractMethodNotImplementedError = req('/lib/errors/abstract-method-not-implemented'),
	InvalidServiceTypeError           = req('/lib/errors/invalid-service-type');

var
	ServiceDetails = req('/lib/service-details'),
	ErrorReasons   = req('/constants/error-reasons'),
	ServiceTypes   = req('/constants/service-types');

var
	NoSuchNickMessage = req('/lib/server/messages/no-such-nick');


class Service {

	constructor() {
		this.validateType();
	}

	validateType() {
		if (!has(ServiceTypes, this.getType())) {
			let reason;

			if (!this.type) {
				reason = ErrorReasons.OMITTED;
			} else {
				reason = ErrorReasons.UNKNOWN_TYPE;
			}

			throw new InvalidServiceTypeError(this.type, reason);
		}
	}

	getType() {
		return this.type;
	}

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

	setServiceRegistry(service_registry) {
		this.service_registry = service_registry;
	}

	getServiceRegistry() {
		return this.service_registry;
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

	registerClient(client, callback) {
		return void defer(callback, null);
	}

	coupleToClient() {
		throw new AbstractMethodNotImplementedError('coupleToClient()');
	}

	decoupleFromClient() {
		throw new AbstractMethodNotImplementedError('decoupleFromClient()');
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

	name:             null,
	type:             null,
	server_details:   null,
	client_registry:  null,
	service_registry: null

});

module.exports = Service;
