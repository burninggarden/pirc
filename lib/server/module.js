
var
	extend = req('/lib/utilities/extend'),
	defer  = req('/lib/utilities/defer');

var
	ModuleTypeValidator = req('/lib/validators/module-type'),
	ServiceDetails      = req('/lib/service-details'),
	ModuleTypes         = req('/lib/constants/module-types'),
	ChannelDetails      = req('/lib/channel-details');

var AbstractMethodNotImplementedError = req('/lib/errors/abstract-method-not-implemented');

var
	NoSuchNickMessage     = req('/lib/server/messages/no-such-nick'),
	NoSuchChannelMessage  = req('/lib/server/messages/no-such-channel'),
	UsersDontMatchMessage = req('/lib/server/messages/users-dont-match'),
	NeedMoreParamsMessage = req('/lib/server/messages/need-more-params');


class Module {

	constructor() {
		this.validateType();
	}

	validateType() {
		ModuleTypeValidator.validate(this.getType());
	}

	getType() {
		return this.type;
	}

	setLocalServerDetails(server_details) {
		this.local_server_details = server_details;
		return this;
	}

	getLocalServerDetails() {
		return this.local_server_details;
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
				Tried to determine module name, but none was set
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

	setModuleRegistry(module_registry) {
		this.module_registry = module_registry;
	}

	getModuleRegistry() {
		return this.module_registry;
	}

	getModuleByType(module_type) {
		ModuleTypeValidator.validate(module_type);

		return this.getModuleRegistry().getModuleByType(module_type);
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
		var nick = user_details.getNick();

		return this.sendNoSuchNickMessageToClientForNick(client, nick);
	}

	sendNoSuchNickMessageToClientForNick(client, nick) {
		var message = new NoSuchNickMessage();

		message.setNick(nick);
		client.sendMessage(message);
	}

	sendUsersDontMatchMessageToClientForUserDetails(client, user_details) {
		var message = new UsersDontMatchMessage();

		// Not much logic required for this message,
		// at least according to the spec...

		client.sendMessage(message);
	}

	sendNoSuchChannelMessageToClientForChannelName(client, channel_name) {
		var message = new NoSuchChannelMessage();

		message.setChannelDetails(ChannelDetails.fromName(channel_name));

		client.sendMessage(message);
	}

	sendNeedMoreParamsMessageToClientForCommand(client, command) {
		var message = new NeedMoreParamsMessage();

		message.setAttemptedCommand(command);
		client.sendMessage(message);
	}

	getObserversForClient(client) {
		var channel_module = this.getModuleByType(ModuleTypes.CHANNEL);

		return channel_module.getObserversForClient(client);
	}

}

extend(Module.prototype, {

	name:                 null,
	type:                 null,
	local_server_details: null,
	client_registry:      null,
	module_registry:      null

});

module.exports = Module;
