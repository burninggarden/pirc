
var
	extend = require('../utility/extend'),
	defer  = require('../utility/defer');

var
	Validator_ModuleType = require('../validator/module-type'),
	ServiceDetails       = require('../service-details');

var
	Enum_ModuleTypes = require('../enum/module-types');

var
	Message_Reply_NoSuchNick         = require('../message/reply/no-such-nick'),
	Message_Reply_NoSuchChannel      = require('../message/reply/no-such-channel'),
	Message_Reply_UsersDontMatch     = require('../message/reply/users-dont-match'),
	Message_Reply_NeedMoreParameters = require('../message/reply/need-more-parameters'),
	Message_Command_Notice           = require('../message/command/notice');


class Server_Module {

	constructor() {
		this.validateType();
	}

	validateType() {
		Validator_ModuleType.validate(this.getType());
	}

	getType() {
		return this.type;
	}

	getServerDetails() {
		return this.getServer().getServerDetails();
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

	/**
	 * @returns {lib/server/connections/client[]}
	 */
	getAllClients() {
		return this.getServer().getClients();
	}

	getModuleByType(module_type) {
		Validator_ModuleType.validate(module_type);

		return this.getServer().getModuleByType(module_type);
	}

	getClientForUserDetails(user_details) {
		return this.getServer().getClientForUserDetails(user_details);
	}

	getClientForNickname(nickname) {
		return this.getServer().getClientForNickname(nickname);
	}

	getClientsForUserDetails(user_details) {
		return this.getServer().getClientsForUserDetails(user_details);
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
		var message = new Message_Reply_NoSuchNick();

		message.setNickname(nickname);
		client.sendMessage(message);
	}

	sendUsersDontMatchMessageToClientForUserDetails(client, user_details) {
		var message = new Message_Reply_UsersDontMatch();

		// Not much logic required for this message,
		// at least according to the spec...

		client.sendMessage(message);
	}

	sendNoSuchChannelMessageToClientForChannelName(client, channel_name) {
		var message = new Message_Reply_NoSuchChannel();

		message.setChannelName(channel_name);

		client.sendMessage(message);
	}

	sendNeedMoreParametersMessageToClientForCommand(client, command) {
		var message = new Message_Reply_NeedMoreParameters();

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
		var message = new Message_Command_Notice();

		message.setMessageBody(notice);
		client.sendMessage(message);
	}

	getObserversForClient(client) {
		var channel_module = this.getModuleByType(Enum_ModuleTypes.CHANNELS);

		return channel_module.getObserversForClient(client);
	}

	/**
	 * @param   {Server} server
	 * @returns {self}
	 */
	setServer(server) {
		this.server = server;
		return this;
	}

	/**
	 * @returns {Server}
	 */
	getServer() {
		return this.server;
	}

}

extend(Server_Module.prototype, {

	name:   null,
	type:   null,
	server: null

});

module.exports = Server_Module;
