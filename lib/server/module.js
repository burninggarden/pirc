
var
	extend = req('/lib/utilities/extend'),
	defer  = req('/lib/utilities/defer');

var
	ModuleTypeValidator = req('/lib/validators/module-type'),
	ServiceDetails      = req('/lib/service-details'),
	ModuleTypes         = req('/lib/constants/module-types');

var
	NoSuchNickMessage         = req('/lib/messages/replies/no-such-nick'),
	NoSuchChannelMessage      = req('/lib/messages/replies/no-such-channel'),
	UsersDontMatchMessage     = req('/lib/messages/replies/users-dont-match'),
	NeedMoreParametersMessage = req('/lib/messages/replies/need-more-parameters');


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

	setServerDetails(server_details) {
		this.server_details = server_details;
		return this;
	}

	getServerDetails() {
		return this.server_details;
	}

	getHostname() {
		return this.getServerDetails().getHostname();
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

	getClientForNickname(nickname) {
		return this.getClientRegistry().getClientForNickname(nickname);
	}

	getClientsForUserDetails(user_details) {
		return this.getClientRegistry().getClientsForUserDetails(user_details);
	}

	handleClientMessage() {
		throw new Error('Implement method: handleClientMessage()');
	}

	registerClient(client, callback) {
		return void defer(callback, null);
	}

	coupleToClient() {
		throw new Error('Implement method: coupleToClient()');
	}

	decoupleFromClient() {
		throw new Error('Implement method: decoupleFromClient()');
	}

	destroy() {
		// Noop by default.
	}

	sendNoSuchNickMessageToClientForUserDetails(client, user_details) {
		var nickname = user_details.getNickname();

		return this.sendNoSuchNickMessageToClientForNickname(client, nickname);
	}

	sendNoSuchNickMessageToClientForNickname(client, nickname) {
		var message = new NoSuchNickMessage();

		message.setNickname(nickname);
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

		message.setChannelName(channel_name);

		client.sendMessage(message);
	}

	sendNeedMoreParametersMessageToClientForCommand(client, command) {
		var message = new NeedMoreParametersMessage();

		message.setAttemptedCommand(command);
		client.sendMessage(message);
	}

	getObserversForClient(client) {
		var channel_module = this.getModuleByType(ModuleTypes.CHANNEL);

		return channel_module.getObserversForClient(client);
	}

}

extend(Module.prototype, {

	name:            null,
	type:            null,
	server_details:  null,
	client_registry: null,
	module_registry: null

});

module.exports = Module;
