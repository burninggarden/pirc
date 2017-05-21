
var
	Net = require('net'),
	FS  = require('fs');

var
	getBasePath   = require('../lib/utilities/get-base-path'),
	extend        = req('/lib/utilities/extend'),
	has           = req('/lib/utilities/has'),
	add           = req('/lib/utilities/add'),
	remove        = req('/lib/utilities/remove'),
	createMessage = req('/lib/utilities/create-message');

var
	PendingConnection = req('/lib/server/connections/pending'),
	ClientConnection  = req('/lib/server/connections/client'),
	ServerConnection  = req('/lib/server/connections/server');

var
	ConnectionEvents = req('/lib/constants/connection-events'),
	Commands         = req('/lib/constants/commands'),
	ServerDetails    = req('/lib/server-details'),
	ClientRegistry   = req('/lib/server/registries/clients'),
	ModuleRegistry   = req('/lib/server/registries/modules'),
	ModuleTypes      = req('/lib/constants/module-types'),
	UserModes        = req('/lib/constants/user-modes'),
	ChannelModes     = req('/lib/constants/channel-modes');

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

const DEFAULT_MOTD_PATH = getBasePath() + '/data/motd.txt';


class Server extends Net.Server {

	constructor(parameters) {
		super();

		this.client_connections  = [ ];
		this.server_connections  = [ ];
		this.pending_connections = [ ];


		var local_server_details = this.getLocalServerDetails();

		if (parameters.hostname) {
			local_server_details.setHostname(parameters.hostname);
		}

		if (parameters.name) {
			local_server_details.setName(parameters.name);
		} else {
			local_server_details.setName(DEFAULT_SERVER_NAME);
		}

		if (parameters.motd === undefined) {
			parameters.motd = FS.readFileSync(DEFAULT_MOTD_PATH, 'utf8');
		}

		local_server_details.setMotd(parameters.motd);

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

		var local_server_details = this.getLocalServerDetails();

		modes.forEach(local_server_details.addUserMode, local_server_details);
	}

	initChannelModes(modes) {
		if (modes) {
			modes = modes.split('');
		} else {
			modes = DEFAULT_CHANNEL_MODES;
		}

		var local_server_details = this.getLocalServerDetails();

		modes.forEach(local_server_details.addChannelMode, local_server_details);
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
		module.setLocalServerDetails(this.getLocalServerDetails());
		module.setModuleRegistry(module_registry);

		module_registry.addModule(module);
	}

	handleConnection(socket) {
		var pending_connection = new PendingConnection(socket);

		pending_connection.setLocalServerDetails(this.getLocalServerDetails());

		this.pending_connections.push(pending_connection);
		this.coupleToPendingConnection(pending_connection);

		// Flush a newline to the client. Some clients are dumb and reliant
		// on data being passed their way before sending any info...
		socket.write('\n');
	}

	coupleToPendingConnection(pending_connection) {
		pending_connection.on(
			ConnectionEvents.UPGRADE_TO_CLIENT_CONNECTION,
			this.upgradePendingConnectionToClientConnection.bind(this, pending_connection)
		);

		pending_connection.on(
			ConnectionEvents.UPGRADE_TO_SERVER_CONNECTION,
			this.upgradePendingConnectionToServerConnection.bind(this, pending_connection)
		);

		pending_connection.on(
			ConnectionEvents.CONNECTION_END,
			this.handlePendingConnectionEnd.bind(this, pending_connection)
		);
	}

	/**
	 * @param   {object} pending_connection
	 * @returns {void}
	 */
	upgradePendingConnectionToClientConnection(pending_connection) {
		var client_connection = ClientConnection.fromPendingConnection(
			pending_connection
		);

		client_connection.setLocalServerDetails(this.getLocalServerDetails());

		this.client_connections.push(client_connection);
		this.coupleToClientConnection(client_connection);

		pending_connection.getQueuedMessages().forEach(function each(message) {
			client_connection.handleInboundMessage(message);
		});

		this.handlePendingConnectionEnd(pending_connection);
	}

	/**
	 * @param   {object} pending_connection
	 * @returns {void}
	 */
	upgradePendingConnectionToServerConnection(pending_connection) {
		var server_connection = ServerConnection.fromPendingConnection(
			pending_connection
		);

		server_connection.setLocalServerDetails(this.getLocalServerDetails());

		this.server_connections.push(server_connection);
		this.coupleToServerConnection(server_connection);

		pending_connection.getQueuedMessages().forEach(function each(message) {
			server_connection.handleInboundMessage(message);
		});

		this.handlePendingConnectionEnd(pending_connection);
	}

	/**
	 * @param   {object} pending_connection
	 * @returns {void}
	 */
	handlePendingConnectionEnd(pending_connection) {
		remove(pending_connection).from(this.pending_connections);
		pending_connection.removeAllListeners();
	}

	coupleToClientConnection(client_connection) {
		client_connection.on(
			ConnectionEvents.INCOMING_MESSAGE,
			this.handleClientConnectionMessage.bind(this, client_connection)
		);

		client_connection.on(
			ConnectionEvents.CONNECTION_END,
			this.handleClientConnectionEnd.bind(this, client_connection)
		);
	}

	handleClientConnectionMessage(client_connection, message) {
		if (!client_connection.hasRegistered()) {
			if (client_connection.canRegister()) {
				this.registerClientConnection(client_connection);
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
			module.handleClientMessage(client_connection, message);
		});
	}

	handleClientConnectionEnd(client_connection) {
		this.getClientRegistry().removeClient(client_connection);

		this.getModules().forEach(function each(module) {
			module.decoupleFromClient(client_connection);
		});

		remove(client_connection).from(this.client_connections);

		client_connection.removeAllListeners();
	}

	registerClientConnection(client_connection) {
		client_connection.setIsRegistering(true);

		var
			modules = this.getModules(),
			index   = 0;

		function advance() {
			var module = modules[index];

			index++;

			function handler(error) {
				if (error) {
					return void this.handleClientConnectionRegistrationFailure(
						error,
						client_connection
					);
				}

				if (index === modules.length) {
					return void this.handleClientConnectionRegistrationSuccess(
						client_connection
					);
				}

				advance.call(this);
			}

			module.registerClient(client_connection, handler.bind(this));
		}

		advance.call(this);
	}

	handleClientConnectionRegistrationSuccess(client_connection) {
		client_connection.setIsRegistering(false);
		client_connection.setHasRegistered(true);

		this.getClientRegistry().addClient(client_connection);

		this.getModules().forEach(function each(module) {
			module.coupleToClient(client_connection);
		});
	}

	handleClientConnectionRegistrationFailure(error, client_connection) {
		client_connection.setIsRegistering(false);
		client_connection.setHasRegistered(false);
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

	sendMessageToClientConnectionViaReplyNumeric(client_connection, reply_numeric) {
		var message = createMessage(reply_numeric);

		client_connection.sendMessage(message);

		return this;
	}

	listen(port) {
		this.setPort(port);

		super.listen(port);
	}

	getPort() {
		return this.getLocalServerDetails().getPort();
	}

	setPort(port) {
		if (this.isListening()) {
			throw new AlreadyListeningError();
		}

		this.getLocalServerDetails().setPort(port);

		return this;
	}

	isListening() {
		return this.listening === true;
	}

	getLocalServerDetails() {
		if (!this.local_server_details) {
			this.local_server_details = new ServerDetails();
		}

		return this.local_server_details;
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

		this.client_connections.forEach(function each(client_connection) {
			client_connection.destroy();
		});

		this.server_connections.forEach(function each(server_connection) {
			server_connection.destroy();
		});

		this.pending_connections.forEach(function each(pending_connection) {
			pending_connection.destroy();
		});

		this.close();
		this.destroyed = true;
	}

}

extend(Server.prototype, {

	client_connections:  null,
	server_connections:  null,
	pending_connections: null,
	modules:             null,
	server_details:      null,
	client_registry:     null,
	module_registry:     null,

	destroyed:           false

});

module.exports = Server;
