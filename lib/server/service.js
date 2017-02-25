
var
	extend = req('/utilities/extend'),
	defer  = req('/utilities/defer');

var
	AbstractMethodNotImplementedError = req('/lib/errors/abstract-method-not-implemented'),
	ServiceTypeValidator              = req('/validators/service-type'),
	ServiceDetails                    = req('/lib/service-details'),
	ServiceTypes                      = req('/constants/service-types'),
	ChannelDetails                    = req('/lib/channel-details');

var
	NoSuchNickMessage    = req('/lib/server/messages/no-such-nick'),
	NoSuchChannelMessage = req('/lib/server/messages/no-such-channel');


class Service {

	constructor() {
		this.validateType();
	}

	validateType() {
		ServiceTypeValidator.validate(this.getType());
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

	getServiceByType(service_type) {
		ServiceTypeValidator.validate(service_type);

		return this.getServiceRegistry().getServiceByType(service_type);
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

	sendNoSuchChannelMessageToClientForChannelName(client, channel_name) {
		var message = new NoSuchChannelMessage();

		message.setChannelDetails(ChannelDetails.fromName(channel_name));

		client.sendMessage(message);
	}

	getObserversForClient(client) {
		var channel_service = this.getServiceByType(ServiceTypes.CHANNEL);

		return channel_service.getObserversForClient(client);
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
