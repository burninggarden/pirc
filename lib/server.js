
var
	Net = require('net');

var
	extend = req('/utilities/extend'),
	has    = req('/utilities/has'),
	add    = req('/utilities/add');

var
	ClientConnection            = req('/lib/server/client-connection'),
	ClientConnectionEvents      = req('/lib/server/client-connection/constants/events'),
	ReplyNumericsToConstructors = req('/mappings/reply-numerics-to-constructors'),
	Commands                    = req('/constants/commands'),
	ServerDetails               = req('/lib/server-details'),
	ClientRegistry              = req('/lib/server/registries/clients'),
	ModuleRegistry              = req('/lib/server/registries/modules'),
	ModuleTypes                 = req('/constants/module-types'),
	UserModes                   = req('/constants/user-modes'),
	ChannelModes                = req('/constants/channel-modes');

var
	AuthModule       = req('/lib/server/modules/auth'),
	ChannelModule    = req('/lib/server/modules/channel'),
	PMModule         = req('/lib/server/modules/pm'),
	NickModule       = req('/lib/server/modules/nick'),
	UserModule       = req('/lib/server/modules/user'),
	PingModule       = req('/lib/server/modules/ping'),
	ServerInfoModule = req('/lib/server/modules/server-info');

var
	NotYetImplementedError = req('/lib/errors/not-yet-implemented'),
	AlreadyListeningError  = req('/lib/errors/already-listening'),
	InvalidModuleTypeError = req('/lib/errors/invalid-module-type');


const DEFAULT_SERVER_NAME = 'πrc Internet Relay Chat server';


const DEFAULT_USER_MODES = [
	UserModes.INVISIBLE,
	UserModes.OPERATOR,
	UserModes.RECEIVES_NOTICES,
	UserModes.WALLOPS
];

const DEFAULT_CHANNEL_MODES = [
	ChannelModes.BAN_MASK,
	// h?
	ChannelModes.INVITE_ONLY,
	ChannelModes.KEY,
	ChannelModes.LIMIT,
	ChannelModes.MODERATED,
	ChannelModes.NO_OUTSIDE_MESSAGES,
	// o?
	ChannelModes.PRIVATE,
	ChannelModes.SECRET,
	ChannelModes.TOPIC_OPERATOR_ONLY,
	ChannelModes.VOICE
];


class Server extends Net.Server {

	constructor(parameters) {
		super();

		this.clients = [ ];

		var server_details = this.getServerDetails();

		if (parameters.hostname) {
			server_details.setHostname(parameters.hostname);
		}

		if (parameters.name) {
			server_details.setName(parameters.name);
		} else {
			server_details.setName(DEFAULT_SERVER_NAME);
		}

		if (parameters.motd) {
			server_details.setMotd(parameters.motd);
		}

		this.bindHandlers();
		this.initModes(parameters);
		this.initModules();
	}

	bindHandlers() {
		this.handleConnection = this.handleConnection.bind(this);
		this.handleClose      = this.handleClose.bind(this);
		this.handleError      = this.handleError.bind(this);

		this.on('connection', this.handleConnection);
		this.on('close',      this.handleClose);
		this.on('error',      this.handleError);
	}

	initModes(parameters) {
		this.initUserModes(parameters.user_modes);
		this.initChannelModes(parameters.channel_modes);
	}

	initUserModes(modes) {
		if (modes) {
			modes = modes.split('');
		} else {
			modes = DEFAULT_USER_MODES;
		}

		var server_details = this.getServerDetails();

		modes.forEach(server_details.addUserMode, server_details);
	}

	initChannelModes(modes) {
		if (modes) {
			modes = modes.split('');
		} else {
			modes = DEFAULT_CHANNEL_MODES;
		}

		var server_details = this.getServerDetails();

		modes.forEach(server_details.addChannelMode, server_details);
	}

	initModules() {
		this.addModule(new AuthModule());
		this.addModule(new ChannelModule());
		this.addModule(new PMModule());
		this.addModule(new NickModule());
		this.addModule(new UserModule());
		this.addModule(new PingModule());
		this.addModule(new ServerInfoModule());
	}

	addModule(module) {
		var module_registry = this.getModuleRegistry();

		module.setClientRegistry(this.getClientRegistry());
		module.setServerDetails(this.getServerDetails());
		module.setModuleRegistry(module_registry);

		module_registry.addModule(module);
	}

	handleConnection(socket) {
		var client = new ClientConnection(socket);

		client.setServerDetails(this.getServerDetails());

		this.clients.push(client);
		this.coupleToClient(client);
	}

	coupleToClient(client) {
		client.on(
			ClientConnectionEvents.INCOMING_MESSAGE,
			this.handleClientMessage.bind(this, client)
		);

		client.on(
			ClientConnectionEvents.CONNECTION_END,
			this.handleClientConnectionEnd.bind(this, client)
		);
	}

	handleClientMessage(client, message) {
		if (!client.hasRegistered()) {
			if (client.canRegister()) {
				this.registerClient(client);
			}

			return;
		}

		var modules = this.getModulesForCommandMessage(message);

		if (modules === null || modules.length === 0) {
			throw new NotYetImplementedError(`
				handling for command: ${message.command}
			`);
		}

		modules.forEach(function each(module) {
			module.handleClientMessage(client, message);
		});
	}

	handleClientConnectionEnd(client) {
		this.getClientRegistry().removeClient(client);

		this.getModules().forEach(function each(module) {
			module.decoupleFromClient(client);
		});

		client.removeAllListeners();
	}

	registerClient(client) {
		client.setIsRegistering(true);

		var
			modules = this.getModules(),
			index   = 0;

		function advance() {
			var module = modules[index];

			index++;

			function handler(error) {
				if (error) {
					return void this.handleClientRegistrationFailure(
						error,
						client
					);
				}

				if (index === modules.length) {
					return void this.handleClientRegistrationSuccess(client);
				}

				advance.call(this);
			}

			module.registerClient(client, handler.bind(this));
		}

		advance.call(this);
	}

	handleClientRegistrationSuccess(client) {
		client.setIsRegistering(false);
		client.setHasRegistered(true);

		this.getClientRegistry().addClient(client);

		this.getModules().forEach(function each(module) {
			module.coupleToClient(client);
		});
	}

	handleClientRegistrationFailure(error, client) {
		client.setIsRegistering(false);
		client.setHasRegistered(false);
	}

	getModulesForCommandMessage(message) {
		var command = message.getCommand();

		switch (command) {
			case Commands.JOIN:
			case Commands.PART:
			case Commands.NAMES:
			case Commands.TOPIC:
				return [this.getModuleByType(ModuleTypes.CHANNEL)];

			case Commands.PING:
			case Commands.PONG:
				return [this.getModuleByType(ModuleTypes.PING)];

			case Commands.USER:
				return [this.getModuleByType(ModuleTypes.USER)];

			case Commands.NICK:
				return [this.getModuleByType(ModuleTypes.NICK)];

			case Commands.MODE:
				return this.getModulesForModeMessage(message);

			case Commands.PRIVMSG:
			case Commands.NOTICE:
				return this.getModulesForPrivateMessage(message);

			case Commands.WHOIS:
				return [this.getModuleByType(ModuleTypes.USER)];

			default:
				return null;
		}
	}

	getModulesForPrivateMessage(message) {
		var modules = [ ];

		if (message.hasChannelTarget()) {
			add(this.getModuleByType(ModuleTypes.CHANNEL)).to(modules);
		}

		if (message.hasUserTarget()) {
			add(this.getModuleByType(ModuleTypes.PM)).to(modules);
		}

		return modules;
	}

	getModulesForModeMessage(message) {
		var modules = [ ];

		if (message.hasChannelTarget()) {
			add(this.getModuleByType(ModuleTypes.CHANNEL)).to(modules);
		}

		if (message.hasUserTarget()) {
			add(this.getModuleByType(ModuleTypes.USER)).to(modules);
		}

		return modules;
	}

	handleClose() {
		this.destroy();
	}

	handleError(error) {
		console.error(error);
		throw new NotYetImplementedError();
	}

	sendMessageToClientViaReplyNumeric(client, reply_numeric) {
		var message = this.createMessageForReplyNumeric(reply_numeric);

		client.sendMessage(message);

		return this;
	}

	createMessageForReplyNumeric(reply_numeric) {
		if (ReplyNumericsToConstructors[reply_numeric] === undefined) {
			throw new NotYetImplementedError('handler for numeric reply: ' + reply_numeric);
		}

		var constructor = ReplyNumericsToConstructors[reply_numeric];

		return new constructor();
	}

	listen(port) {
		this.setPort(port);

		super.listen(port);
	}

	getPort() {
		return this.getServerDetails().getPort();
	}

	setPort(port) {
		if (this.isListening()) {
			throw new AlreadyListeningError();
		}

		this.getServerDetails().setPort(port);
		return this;
	}

	isListening() {
		return this.listening === true;
	}

	getServerDetails() {
		if (!this.server_details) {
			this.server_details = new ServerDetails();
		}

		return this.server_details;
	}

	getClientRegistry() {
		if (!this.client_registry) {
			this.client_registry = new ClientRegistry();
		}

		return this.client_registry;
	}

	getModules() {
		return this.getModuleRegistry().getModules();
	}

	getModuleByType(module_type) {
		if (!has(ModuleTypes, module_type)) {
			throw new InvalidModuleTypeError(module_type);
		}

		return this.getModuleRegistry().getModuleByType(module_type);
	}

	getModuleRegistry() {
		if (!this.module_registry) {
			this.module_registry = new ModuleRegistry();
		}

		return this.module_registry;
	}

	destroy() {
		if (this.destroyed) {
			return;
		}

		this.getModules().forEach(function each(module) {
			module.destroy();
		});

		this.clients.forEach(function each(client) {
			client.destroy();
		});

		this.close();
		this.destroyed = true;
	}

}

extend(Server.prototype, {

	clients:         null,
	modules:         null,
	server_details:  null,
	client_registry: null,
	module_registry: null,

	destroyed:       false

});

module.exports = Server;
