
var
	extend = req('/lib/utility/extend'),
	defer  = req('/lib/utility/defer');

var
	ModuleTypeValidator = req('/lib/validator/module-type'),
	ServiceDetails      = req('/lib/service-details');

var
	Enum_ModuleTypes = req('/lib/enum/module-types');

var
	NoSuchNickMessage         = req('/lib/message/reply/no-such-nick'),
	NoSuchChannelMessage      = req('/lib/message/reply/no-such-channel'),
	UsersDontMatchMessage     = req('/lib/message/reply/users-dont-match'),
	NeedMoreParametersMessage = req('/lib/message/reply/need-more-parameters'),
	NoticeMessage             = req('/lib/message/command/notice');


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

	/**
	 * @returns {lib/server/connections/client[]}
	 */
	getAllClients() {
		return this.getClientRegistry().getClients();
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

	destroy(callback) {
		// Noop by default.
		return void callback(null);
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

	/**
	 * @param   {string} notice
	 * @returns {void}
	 */
	sendNoticeToAllClients(notice) {
		this.getAllClients().forEach(function each(client) {
			this.sendNoticeToClient(notice, client);
		}, this);
	}

	/**
	 * @param   {string} notice
	 * @param   {lib/server/connection/client} client
	 * @returns {void}
	 */
	sendNoticeToClient(notice, client) {
		var message = new NoticeMessage();

		message.setMessageBody(notice);
		client.sendMessage(message);
	}

	getObserversForClient(client) {
		var channel_module = this.getModuleByType(Enum_ModuleTypes.CHANNELS);

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
