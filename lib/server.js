
var
	Net    = require('net'),
	FS     = require('fs'),
	Promix = require('promix');

var getBasePath = require('../lib/utilities/get-base-path');

var
	extend        = req('/lib/utilities/extend'),
	has           = req('/lib/utilities/has'),
	add           = req('/lib/utilities/add'),
	each          = req('/lib/utilities/each'),
	remove        = req('/lib/utilities/remove'),
	isFunction    = req('/lib/utilities/is-function'),
	deferOrThrow  = req('/lib/utilities/defer-or-throw'),
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
	ChannelModes     = req('/lib/constants/channel-modes'),
	Replies          = req('/lib/constants/replies'),
	TargetTypes      = req('/lib/constants/target-types');


var
	AuthModule       = req('/lib/server/modules/auth'),
	ChannelModule    = req('/lib/server/modules/channels'),
	PMModule         = req('/lib/server/modules/pms'),
	NickModule       = req('/lib/server/modules/nicknames'),
	UserModule       = req('/lib/server/modules/users'),
	OperatorModule   = req('/lib/server/modules/operators'),
	PingModule       = req('/lib/server/modules/ping'),
	ServerInfoModule = req('/lib/server/modules/server-info');


const DEFAULT_SERVER_NAME = 'πrc Internet Relay Chat server';


const DEFAULT_USER_MODES = [
	UserModes.INVISIBLE,
	UserModes.LOCAL_OPERATOR,
	UserModes.OPERATOR,
	UserModes.RECEIVES_NOTICES,
	UserModes.RESTRICTED,
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
	ChannelModes.TOPIC_OPERATOR_ONLY
];

const DEFAULT_MOTD_PATH = getBasePath() + '/data/motd.txt';


class Server {

	constructor(parameters) {
		this.instantiateMessages();

		this.client_connections  = [ ];
		this.server_connections  = [ ];
		this.pending_connections = [ ];

		var server_details = this.getServerDetails();

		if (parameters.hostname) {
			server_details.setHostname(parameters.hostname);
		} else {
			server_details.setHostname('localhost');
		}

		if (parameters.name) {
			server_details.setName(parameters.name);
		} else {
			server_details.setName(DEFAULT_SERVER_NAME);
		}

		if (parameters.motd === undefined) {
			parameters.motd = FS.readFileSync(DEFAULT_MOTD_PATH, 'utf8');
		}

		server_details.setMotd(parameters.motd);

		if (parameters.log_inbound_messages) {
			this.setLogInboundMessages(parameters.log_inbound_messages);
		}

		if (parameters.log_outbound_messages) {
			this.setLogOutboundMessages(parameters.log_outbound_messages);
		}

		this.bindHandlers();
		this.initModes(parameters);
		this.initModules();

		if (parameters.authenticateUser !== undefined) {
			let module = this.getModuleByType(ModuleTypes.AUTH);

			module.setAuthenticationCallback(parameters.authenticateUser);
		}

		if (parameters.authenticateOperator !== undefined) {
			let module = this.getModuleByType(ModuleTypes.OPERATORS);

			module.setAuthenticationCallback(parameters.authenticateOperator);
		}

		if (parameters.port) {
			this.setPort(parameters.port);
			this.createRawServer();
		}
	}

	/**
	 * This instantiates one of each possible type of message.
	 * It creates a message for each reply numeric that the server can return
	 * to the client, as well as a message for both the client and server
	 * variants of each command.
	 *
	 * We do this so that the runtime sanity checks performed by the message
	 * base class when a message is instantiated will run at server start,
	 * instead of having to wait for an instance of that message to be
	 * generated organically.
	 *
	 * @returns {void}
	 */
	instantiateMessages() {
		each(Replies, function each(key, reply) {
			createMessage(reply);
		});

		each(Commands, function each(key, command) {
			createMessage(command);
		});
	}

	bindHandlers() {
		this.handleConnection = this.handleConnection.bind(this);
		this.handleError      = this.handleError.bind(this);
		this.handleClose      = this.handleClose.bind(this);
	}

	/**
	 * @param   {Net.Server} raw_server
	 * @returns {self}
	 */
	setRawServer(raw_server) {
		if (this.raw_server) {
			this.decoupleFromRawServer(this.raw_server);
		}

		this.raw_server = raw_server;

		if (this.raw_server) {
			this.coupleToRawServer(this.raw_server);
		}

		return this;
	}

	/**
	 * @returns {Net.Server}
	 */
	getRawServer() {
		return this.raw_server;
	}

	/**
	 * @param   {Net.Server} raw_server
	 * @returns {void}
	 */
	decoupleFromRawServer(raw_server) {
		raw_server.removeListener('connection', this.handleConnection);
		raw_server.removeListener('close',      this.handleClose);
		raw_server.removeListener('error',      this.handleError);
	}

	/**
	 * @param   {Net.Server} raw_server
	 * @returns {void}
	 */
	coupleToRawServer(raw_server) {
		raw_server.on('connection', this.handleConnection);
		raw_server.on('close',      this.handleClose);
		raw_server.on('error',      this.handleError);
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
		this.addModule(new OperatorModule());
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
		var pending_connection = new PendingConnection();

		pending_connection.setInboundSocket(socket);

		this.pending_connections.push(pending_connection);
		this.coupleToPendingConnection(pending_connection);

		// Flush a newline to the client. Some clients are dumb and reliant
		// on data being passed their way before sending any info...
		socket.write('\n');
	}

	coupleToConnection(connection) {
		connection.setLocalServerDetails(this.getServerDetails());
		connection.setLogInboundMessages(this.shouldLogInboundMessages());
		connection.setLogOutboundMessages(this.shouldLogOutboundMessages());
	}

	coupleToPendingConnection(pending_connection) {
		this.coupleToConnection(pending_connection);

		pending_connection.on(
			ConnectionEvents.UPGRADE_TO_CLIENT_CONNECTION,
			this.upgradePendingConnectionToClientConnection.bind(this)
		);

		pending_connection.on(
			ConnectionEvents.UPGRADE_TO_SERVER_CONNECTION,
			this.upgradePendingConnectionToServerConnection.bind(this)
		);

		pending_connection.on(
			ConnectionEvents.CONNECTION_END,
			this.handlePendingConnectionEnd.bind(this)
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

		client_connection.setLocalServerDetails(this.getServerDetails());
		client_connection.setLogInboundMessages(this.shouldLogInboundMessages());
		client_connection.setLogOutboundMessages(this.shouldLogOutboundMessages());

		this.client_connections.push(client_connection);
		this.coupleToClientConnection(client_connection);

		pending_connection.getQueuedMessages().forEach(function each(message) {
			client_connection.handleInboundMessageSafe(message);
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

		this.server_connections.push(server_connection);
		this.coupleToServerConnection(server_connection);

		pending_connection.getQueuedMessages().forEach(function each(message) {
			server_connection.handleInboundMessageSafe(message);
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
		this.coupleToConnection(client_connection);

		client_connection.on(
			ConnectionEvents.INCOMING_MESSAGE,
			this.handleClientConnectionIncomingMessage.bind(this)
		);

		client_connection.on(
			ConnectionEvents.OUTGOING_MESSAGE_START,
			this.handleClientConnectionOutgoingMessageStart.bind(this)
		);

		client_connection.on(
			ConnectionEvents.OUTGOING_MESSAGE_END,
			this.handleClientConnectionOutgoingMessageEnd.bind(this)
		);

		client_connection.on(
			ConnectionEvents.CONNECTION_END,
			this.handleClientConnectionEnd.bind(this)
		);
	}

	/**
	 * @param   {lib/server/connections/client} client_connection
	 * @param   {lib/message} message
	 * @returns {void}
	 */
	handleClientConnectionIncomingMessage(client_connection, message) {
		if (message.hasImmediateResponse()) {
			client_connection.sendMessage(message.getImmediateResponse());

			if (message.isLethal()) {
				client_connection.disconnect();
			}

			return;
		}

		if (!client_connection.isRegistered()) {
			if (client_connection.canRegister()) {
				this.registerClientConnection(client_connection);
			}

			return;
		}

		var modules = this.getModulesForCommandMessage(message);

		if (modules === null || modules.length === 0) {
			throw new Error(
				`Implement handling for command: ${message.command}`
			);
		}

		modules.forEach(function each(module) {
			module.handleClientMessage(client_connection, message);
		});
	}

	/**
	 * This handler is invoked when a client connection queues an outbound
	 * message. At this point the message hasn't been written to the socket.
	 *
	 * @param   {lib/server/connections/client} client_connection
	 * @param   {lib/message} message
	 * @returns {void}
	 */
	handleClientConnectionOutgoingMessageStart(client_connection, message) {
		this.incrementOutgoingMessageCount();
	}

	/**
	 * This handler is invoked when a client actually finishes writing an
	 * outbound message to the underlying net socket.
	 *
	 * @param   {lib/server/connections/client} client_connection
	 * @param   {lib/message} message
	 * @returns {void}
	 */
	handleClientConnectionOutgoingMessageEnd(client_connection, message) {
		this.decrementOutgoingMessageCount();

		if (this.shouldRestart() && this.canRestart()) {
			this.restart();
		}
	}

	/**
	 * @param   {lib/server/connections/client} client_connection
	 * @returns {void}
	 */
	handleClientConnectionEnd(client_connection) {
		this.getClientRegistry().removeClient(client_connection);

		this.getModules().forEach(function each(module) {
			module.decoupleFromClient(client_connection);
		});

		remove(client_connection).from(this.client_connections);

		client_connection.removeAllListeners();
	}

	/**
	 * @param   {lib/server/connections/client} client_connection
	 * @returns {void}
	 */
	registerClientConnection(client_connection) {
		var
			modules = this.getModules(),
			index   = 0;

		function advance() {
			var module = modules[index];

			index++;

			function handler(error) {
				if (error) {
					return void this.handleClientConnectionRegistrationFailure(
						client_connection,
						error
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

	/**
	 * @param   {lib/server/connections/client} client_connection
	 * @returns {void}
	 */
	handleClientConnectionRegistrationSuccess(client_connection) {
		client_connection.setIsRegistering(false);
		client_connection.setIsRegistered(true);

		this.getClientRegistry().addClient(client_connection);

		this.getModules().forEach(function each(module) {
			module.coupleToClient(client_connection);
		});

		client_connection.dequeueMessagesFollowingRegistration();
	}

	/**
	 * @param   {lib/server/connections/client} client_connection
	 * @param   {Error} error
	 * @returns {void}
	 */
	handleClientConnectionRegistrationFailure(client_connection, error) {
		client_connection.setIsRegistering(false);
		client_connection.setIsRegistered(false);
	}

	/**
	 * @param   {lib/message} message
	 * @returns {lib/server/module[]}
	 */
	getModulesForCommandMessage(message) {
		var command = message.getCommand();

		switch (command) {
			case Commands.AWAY:
				return [this.getModuleByType(ModuleTypes.USERS)];

			case Commands.JOIN:
				return [this.getModuleByType(ModuleTypes.CHANNELS)];

			case Commands.MODE:
				return this.getModulesForModeMessage(message);

			case Commands.NAMES:
				return [this.getModuleByType(ModuleTypes.CHANNELS)];

			case Commands.NICK:
				return [this.getModuleByType(ModuleTypes.NICKNAMES)];

			case Commands.NOTICE:
				return this.getModulesForPrivateMessage(message);

			case Commands.OPER:
				return [this.getModuleByType(ModuleTypes.OPERATORS)];

			case Commands.PART:
				return [this.getModuleByType(ModuleTypes.CHANNELS)];

			case Commands.PING:
				return [this.getModuleByType(ModuleTypes.PING)];

			case Commands.PONG:
				return [this.getModuleByType(ModuleTypes.PING)];

			case Commands.PRIVMSG:
				return this.getModulesForPrivateMessage(message);

			case Commands.QUIT:
				return [this.getModuleByType(ModuleTypes.USERS)];

			case Commands.RESTART:
				return [this.getModuleByType(ModuleTypes.OPERATORS)];

			case Commands.TOPIC:
				return [this.getModuleByType(ModuleTypes.CHANNELS)];

			case Commands.USER:
				return [this.getModuleByType(ModuleTypes.USERS)];

			case Commands.WHOIS:
				return [this.getModuleByType(ModuleTypes.USERS)];

			default:
				return null;
		}
	}

	/**
	 * @param   {lib/messages/commands/private} message
	 * @returns {lib/server/module[]}
	 */
	getModulesForPrivateMessage(message) {
		var modules = [ ];

		if (message.hasChannelMessageTargets()) {
			add(this.getModuleByType(ModuleTypes.CHANNELS)).to(modules);
		}

		if (message.hasUserMessageTargets()) {
			add(this.getModuleByType(ModuleTypes.PMS)).to(modules);
		}

		return modules;
	}

	/**
	 * @param   {lib/messages/commands/mode} message
	 * @returns {lib/server/module[]}
	 */
	getModulesForModeMessage(message) {
		var
			modules     = [ ],
			target_type = message.getTargetType();

		switch (target_type) {
			case TargetTypes.CHANNEL:
				add(this.getModuleByType(ModuleTypes.CHANNELS)).to(modules);
				break;

			case TargetTypes.USER:
				add(this.getModuleByType(ModuleTypes.USERS)).to(modules);
				break;

			default:
				throw new Error('Invalid target type: ' + target_type);
		}

		return modules;
	}

	handleClose() {
		this.setIsDestroying(false);
		this.setIsDestroyed(true);

		this.dispatchDestructionCallbacks(null);
	}

	handleError(error) {
		throw error;
	}

	sendMessageToClientConnectionViaReply(client_connection, reply) {
		var message = createMessage(reply);

		client_connection.sendMessage(message);

		return this;
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
			throw new Error('Already listening');
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
			throw new Error('Invalid module type: ' + module_type);
		}

		return this.getModuleRegistry().getModuleByType(module_type);
	}

	getModuleRegistry() {
		if (!this.module_registry) {
			this.module_registry = new ModuleRegistry();
		}

		return this.module_registry;
	}

	/**
	 * @param   {function} callback
	 * @returns {void}
	 */
	destroy(callback) {
		if (!this.stamp) {
			this.stamp = Math.random().toString(16).slice(3);
		}

		if (!isFunction(callback)) {
			throw new Error('Must specify a function callback');
		}

		if (this.isDestroyed()) {
			return void callback(new Error('Server was already destroyed'));
		}

		this.addDestructionCallback(callback);

		if (this.isDestroying()) {
			return;
		}

		this.setIsDestroying(true);

		var chain = Promix.chain();

		this.getModules().forEach(function each(module) {
			chain.andCall(module.destroy).bind(module);
		});

		this.client_connections.forEach(function each(client_connection) {
			chain.andCall(client_connection.disconnectSafe);
			chain.bind(client_connection);
		});

		this.server_connections.forEach(function each(server_connection) {
			chain.andCall(server_connection.disconnectSafe);
			chain.bind(server_connection);
		});

		this.pending_connections.forEach(function each(pending_connection) {
			chain.andCall(pending_connection.disconnectSafe);
			chain.bind(pending_connection);
		});

		chain.then(function finisher() {
			var server = this.getRawServer();

			server.close();
			server.unref();
		}).bind(this);
	}

	/**
	 * @returns {boolean}
	 */
	isDestroying() {
		return this.is_destroying;
	}

	/**
	 * @param   {boolean} is_destroying
	 * @returns {self}
	 */
	setIsDestroying(is_destroying) {
		this.is_destroying = is_destroying;
		return this;
	}

	/**
	 * @returns {boolean}
	 */
	isDestroyed() {
		return this.is_destroyed;
	}

	setIsDestroyed(is_destroyed) {
		this.is_destroyed = is_destroyed;
		return this;
	}

	addDestructionCallback(callback) {
		add(callback).to(this.getDestructionCallbacks());
	}

	getDestructionCallbacks() {
		if (!this.destruction_callbacks) {
			this.resetDestructionCallbacks();
		}

		return this.destruction_callbacks;
	}

	resetDestructionCallbacks() {
		var prior_callbacks = this.destruction_callbacks;

		this.destruction_callbacks = [ ];

		return prior_callbacks || [ ];
	}

	dispatchDestructionCallbacks(error) {
		this.resetDestructionCallbacks().forEach(function each(callback) {
			callback(error);
		});
	}

	setLogInboundMessages(log_inbound_messages) {
		this.log_inbound_messages = log_inbound_messages;
		return this;
	}

	shouldLogInboundMessages() {
		return this.log_inbound_messages;
	}

	setLogOutboundMessages(log_outbound_messages) {
		this.log_outbound_messages = log_outbound_messages;
		return this;
	}

	shouldLogOutboundMessages() {
		return this.log_outbound_messages;
	}

	/**
	 * @returns {self}
	 */
	incrementOutgoingMessageCount() {
		return this.setOutgoingMessageCount(this.getOutgoingMessageCount() + 1);
	}

	/**
	 * @returns {self}
	 */
	decrementOutgoingMessageCount() {
		return this.setOutgoingMessageCount(this.getOutgoingMessageCount() - 1);
	}

	/**
	 * @returns {int}
	 */
	getOutgoingMessageCount() {
		return this.outgoing_message_count;
	}

	/**
	 * @param   {int} count
	 * @returns {self}
	 */
	setOutgoingMessageCount(count) {
		this.outgoing_message_count = count;
		return this;
	}

	/**
	 * @returns {boolean}
	 */
	hasOutgoingMessages() {
		return this.getOutgoingMessageCount() > 0;
	}

	/**
	 * @returns {boolean}
	 */
	shouldRestart() {
		return this.getServerDetails().shouldRestart();
	}

	/**
	 * @returns {boolean}
	 */
	canRestart() {
		return !this.hasOutgoingMessages();
	}

	/**
	 * @returns {void}
	 */
	restart() {
		function handler() {
			function deferred() {
				this.createRawServer();
			}

			setTimeout(deferred.bind(this), 2000);
		}

		this.getServerDetails().setShouldRestart(false);
		this.destroy(handler.bind(this));
	}

	/**
	 * @param   {int} port
	 * @returns {self}
	 */
	setPort(port) {
		this.port = port;
		return this;
	}

	/**
	 * @returns {int|null}
	 */
	getPort() {
		return this.port;
	}

	/**
	 * @returns {boolean}
	 */
	hasPort() {
		return this.getPort() !== null;
	}

	/**
	 * @returns {void}
	 */
	createRawServer() {
		var port = this.getPort();

		if (!port) {
			throw new Error('No port set on Pirc.Server instance');
		}

		var server = new Net.Server();

		server.listen(port);

		this.setIsDestroying(false);
		this.setIsDestroyed(false);
		this.setRawServer(server);
	}

	/**
	 * Used for connecting this server instance to another running remotely.
	 *
	 * @param   {object} parameters
	 * @param   {function} callback
	 * @returns {void}
	 */
	connectToServer(parameters, callback) {
		if (!isFunction(callback)) {
			throw new Error('Must supply a callback function');
		}

		var server_connection;

		parameters = extend(this.getDefaultConnectionParameters(), parameters);

		function handleConnected(error) {
			if (error) {
				return void callback(error);
			}
		}

		try {
			server_connection = new ServerConnection(parameters);
			server_connection.connect(handleConnected.bind(this));
		} catch (error) {
			return void deferOrThrow(callback, error);
		}

		this.coupleToServerConnection(server_connection);
	}

}

extend(Server.prototype, {

	client_connections:     null,
	server_connections:     null,
	pending_connections:    null,
	modules:                null,
	server_details:         null,
	client_registry:        null,
	module_registry:        null,

	is_destroyed:           false,
	is_destroying:          false,
	destruction_callbacks:  null,
	log_inbound_messages:   false,
	log_outbound_messages:  false,
	outgoing_message_count: 0,

	port:                   null,
	raw_server:             null

});

module.exports = Server;
