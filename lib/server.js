
var
	Net    = require('net'),
	FS     = require('fs'),
	Promix = require('promix');

var getBasePath = require('../lib/utility/get-base-path');

var
	extend       = require('./utility/extend'),
	add          = require('./utility/add'),
	has          = require('./utility/has'),
	each         = require('./utility/each'),
	remove       = require('./utility/remove'),
	isFunction   = require('./utility/is-function'),
	deferOrThrow = require('./utility/defer-or-throw'),
	randomString = require('./utility/random-string');

var
	Server_Connection_Pending = require('./server/connection/pending'),
	Server_Connection_Client  = require('./server/connection/client'),
	Server_Connection_Server  = require('./server/connection/server');

var
	Enum_ConnectionEvents = require('./enum/connection-events'),
	Enum_Commands         = require('./enum/commands'),
	Enum_ModuleTypes      = require('./enum/module-types'),
	Enum_UserModes        = require('./enum/user-modes'),
	Enum_ChannelModes     = require('./enum/channel-modes'),
	Enum_Replies          = require('./enum/replies'),
	Enum_TargetTypes      = require('./enum/target-types');

var
	ServerDetails = require('./server-details'),
	Message       = require('./message');


var
	Server_Module_Authentication  = require('./server/module/authentication'),
	Server_Module_Channels        = require('./server/module/channels'),
	Server_Module_HostInfo        = require('./server/module/host-info'),
	Server_Module_Network         = require('./server/module/network'),
	Server_Module_Nicknames       = require('./server/module/nicknames'),
	Server_Module_Operators       = require('./server/module/operators'),
	Server_Module_Pings           = require('./server/module/pings'),
	Server_Module_PrivateMessages = require('./server/module/private-messages'),
	Server_Module_Users           = require('./server/module/users');


const DEFAULT_SERVER_NAME = 'πrc Internet Relay Chat server';

const DEFAULT_PASSWORD = randomString(16);

const DEFAULT_HOSTNAME = 'localhost';

const DEFAULT_USER_MODES = [
	Enum_UserModes.INVISIBLE,
	Enum_UserModes.LOCAL_OPERATOR,
	Enum_UserModes.OPERATOR,
	Enum_UserModes.RECEIVES_NOTICES,
	Enum_UserModes.RESTRICTED,
	Enum_UserModes.WALLOPS
];

const DEFAULT_CHANNEL_MODES = [
	Enum_ChannelModes.BAN_MASK,
	// h?
	Enum_ChannelModes.INVITE_ONLY,
	Enum_ChannelModes.KEY,
	Enum_ChannelModes.LIMIT,
	Enum_ChannelModes.MODERATED,
	Enum_ChannelModes.NO_OUTSIDE_MESSAGES,
	// o?
	Enum_ChannelModes.PRIVATE,
	Enum_ChannelModes.SECRET,
	Enum_ChannelModes.TOPIC_OPERATOR_ONLY
];

const DEFAULT_MOTD = FS.readFileSync(getBasePath() + '/data/motd.txt', 'utf8');


class Server {

	constructor(parameters) {
		parameters = extend(this.getDefaultParameters(), parameters);

		this.setHostname(parameters.hostname);
		this.setPassword(parameters.password);
		this.setName(parameters.name);
		this.setMotd(parameters.motd);
		this.setLogIncomingMessages(parameters.log_incoming_messages);
		this.setLogOutgoingMessages(parameters.log_outgoing_messages);

		this.initModules();
		this.initMessages();
		this.initHandlers();
		this.initModesFromParameters(parameters);
		this.initAuthenticationCallbacksFromParameters(parameters);

		this.connections = [ ];

		if (parameters.port) {
			this.setPort(parameters.port);
			this.createRawServer();
		}
	}

	getDefaultParameters() {
		return {
			hostname:              DEFAULT_HOSTNAME,
			password:              DEFAULT_PASSWORD,
			name:                  DEFAULT_SERVER_NAME,
			motd:                  DEFAULT_MOTD,
			log_incoming_messages: false,
			log_outgoing_messages: false,
			port:                  null
		};
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
	initMessages() {
		each(Enum_Replies, function each(key, reply) {
			Message.fromReply(reply);
		});

		each(Enum_Commands, function each(key, command) {
			Message.fromCommand(command);
		});
	}

	initHandlers() {
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

	initModesFromParameters(parameters) {
		this.initUserModes(parameters.user_modes);
		this.initChannelModes(parameters.channel_modes);
	}

	initAuthenticationCallbacksFromParameters(parameters) {
		if (parameters.authenticateUser) {
			let module = this.getModuleByType(Enum_ModuleTypes.AUTHENTICATION);

			module.setAuthenticationCallback(parameters.authenticateUser);
		}

		if (parameters.authenticateOperator) {
			let module = this.getModuleByType(Enum_ModuleTypes.OPERATORS);

			module.setAuthenticationCallback(parameters.authenticateOperator);
		}

		if (parameters.authenticateServer) {
			let module = this.getModuleByType(Enum_ModuleTypes.NETWORK);

			module.setAuthenticationCallback(parameters.authenticateServer);
		}

		if (parameters.authenticateService) {
			throw new Error('todo');
		}
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
		this.initModule(Server_Module_Authentication);
		this.initModule(Server_Module_Channels);
		this.initModule(Server_Module_PrivateMessages);
		this.initModule(Server_Module_Network);
		this.initModule(Server_Module_Nicknames);
		this.initModule(Server_Module_Users);
		this.initModule(Server_Module_Operators);
		this.initModule(Server_Module_Pings);
		this.initModule(Server_Module_HostInfo);
	}

	/**
	 * @param   {function} constructor
	 * @returns {void}
	 */
	initModule(constructor) {
		var module = new constructor();

		module.setServer(this);

		this.addModule(module);
	}

	/**
	 * @param   {Server_Module} module
	 * @returns {void}
	 */
	addModule(module) {
		add(module).to(this.getModules());
	}

	/**
	 * @returns {Server_Module[]}
	 */
	getModules() {
		if (!this.modules) {
			this.modules = [ ];
		}

		return this.modules;
	}

	/**
	 * @param   {Enum_ModuleTypes.XXX} module_type
	 * @returns {Server_Module|null}
	 */
	getModuleByType(module_type) {
		if (!has(Enum_ModuleTypes, module_type)) {
			throw new Error('Invalid module type: ' + module_type);
		}

		var
			index   = 0,
			modules = this.getModules();

		while (index < modules.length) {
			let module = modules[index];

			if (module.getType() === module_type) {
				return module;
			}

			index++;
		}

		return null;
	}

	handleConnection(socket) {
		var pending_connection = new Server_Connection_Pending();

		pending_connection.setIncomingSocket(socket);

		this.coupleToConnection(pending_connection);

		// Flush a newline to the client. Some clients are dumb and reliant
		// on data being passed their way before sending any info...
		socket.write('\n');
	}

	coupleToConnection(connection) {
		add(connection).to(this.connections);

		connection.on(
			Enum_ConnectionEvents.UPGRADE_TO_CLIENT_CONNECTION,
			this.upgradeConnectionToClientConnection.bind(this)
		);

		connection.on(
			Enum_ConnectionEvents.UPGRADE_TO_SERVER_CONNECTION,
			this.upgradeConnectionToServerConnection.bind(this)
		);

		connection.on(
			Enum_ConnectionEvents.INCOMING_MESSAGE,
			this.handleConnectionIncomingMessage.bind(this)
		);

		connection.on(
			Enum_ConnectionEvents.OUTGOING_MESSAGE_START,
			this.handleConnectionOutgoingMessageStart.bind(this)
		);

		connection.on(
			Enum_ConnectionEvents.OUTGOING_MESSAGE_END,
			this.handleConnectionOutgoingMessageEnd.bind(this)
		);

		connection.on(
			Enum_ConnectionEvents.CONNECTION_END,
			this.handleConnectionEnd.bind(this)
		);

		connection.setLocalServerDetails(this.getServerDetails());
		connection.setLogIncomingMessages(this.shouldLogIncomingMessages());
		connection.setLogOutgoingMessages(this.shouldLogOutgoingMessages());
	}

	/**
	 * @param   {object} connection
	 * @returns {void}
	 */
	upgradeConnectionToClientConnection(connection) {
		return this.upgradeConnectionToConstructor(
			connection,
			Server_Connection_Client
		);
	}

	upgradeConnectionToServerConnection(connection) {
		return this.upgradeConnectionToConstructor(
			connection,
			Server_Connection_Server
		);
	}

	upgradeConnectionToConstructor(old_connection, constructor) {
		if (!old_connection.isPendingConnection()) {
			throw new Error(
				'Got an upgrade request from a non-pending connection'
			);
		}

		var new_connection = constructor.fromPendingConnection(old_connection);

		new_connection.setLocalServerDetails(this.getServerDetails());
		new_connection.setLogIncomingMessages(this.shouldLogIncomingMessages());
		new_connection.setLogOutgoingMessages(this.shouldLogOutgoingMessages());

		this.coupleToConnection(new_connection);

		old_connection.getQueuedMessages().forEach(function each(message) {
			new_connection.handleIncomingMessageSafe(message);
		});

		this.handleConnectionEnd(old_connection);
	}

	/**
	 * @param   {Server_Connection} connection
	 * @returns {void}
	 */
	handleConnectionEnd(connection) {
		remove(connection).from(this.connections);
		connection.removeAllListeners();

		if (!connection.isPendingConnection()) {
			this.getModules().forEach(function each(module) {
				module.decoupleFromConnection(connection);
			});
		}
	}

	handleConnectionIncomingMessage(connection, message) {
		if (message.hasImmediateResponse()) {
			connection.sendMessage(message.getImmediateResponse());

			if (message.isLethal()) {
				connection.disconnect();
			}

			return;
		}

		if (!connection.isRegistered()) {
			if (connection.canRegister()) {
				this.registerConnection(connection);
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
			module.handleConnectionMessage(connection, message);
		});
	}

	/**
	 * @param   {Server_Connection} connection
	 * @returns {void}
	 */
	registerConnection(connection) {
		var
			modules = this.getModules(),
			index   = 0;

		function advance() {
			var module = modules[index];

			index++;

			function handler(error) {
				if (error) {
					return void this.handleConnectionRegistrationFailure(
						connection,
						error
					);
				}

				if (index === modules.length) {
					return void this.handleConnectionRegistrationSuccess(
						connection
					);
				}

				advance.call(this);
			}

			module.registerConnection(connection, handler.bind(this));
		}

		advance.call(this);
	}

	/**
	 * @param   {Server_Connection_Client} connection
	 * @returns {void}
	 */
	handleConnectionRegistrationSuccess(connection) {
		connection.setIsRegistering(false);
		connection.setIsRegistered(true);

		this.getModules().forEach(function each(module) {
			module.coupleToConnection(connection);
		});

		connection.dequeueMessagesFollowingRegistration();
	}

	/**
	 * @param   {Server_Connection_Client} connection
	 * @param   {Error} error
	 * @returns {void}
	 */
	handleConnectionRegistrationFailure(connection, error) {
		connection.setIsRegistering(false);
		connection.setIsRegistered(false);

		if (connection.isServerConnection()) {
			connection.destroy();
		}
	}

	/**
	 * This handler is invoked when a connection queues an outgoing message.
	 * At this point the message hasn't been written to the socket.
	 *
	 * @param   {Server_Connection} connection
	 * @param   {Message} message
	 * @returns {void}
	 */
	handleConnectionOutgoingMessageStart(connection, message) {
		this.incrementOutgoingMessageCount();
	}

	/**
	 * This handler is invoked when a connection actually finishes writing an
	 * outgoing message to the underlying net socket.
	 *
	 * @param   {Server_Connection} connection
	 * @param   {Message} message
	 * @returns {void}
	 */
	handleConnectionOutgoingMessageEnd(connection, message) {
		this.decrementOutgoingMessageCount();

		if (this.shouldRestart() && this.canRestart()) {
			this.restart();
		}
	}

	/**
	 * @param   {Message} message
	 * @returns {Server_Module[]}
	 */
	getModulesForCommandMessage(message) {
		var command = message.getCommand();

		switch (command) {
			case Enum_Commands.AWAY:
				return [this.getModuleByType(Enum_ModuleTypes.USERS)];

			case Enum_Commands.CONNECT:
				return [this.getModuleByType(Enum_ModuleTypes.OPERATORS)];

			case Enum_Commands.JOIN:
				return [this.getModuleByType(Enum_ModuleTypes.CHANNELS)];

			case Enum_Commands.MODE:
				return this.getModulesForModeMessage(message);

			case Enum_Commands.NAMES:
				return [this.getModuleByType(Enum_ModuleTypes.CHANNELS)];

			case Enum_Commands.NICK:
				return [this.getModuleByType(Enum_ModuleTypes.NICKNAMES)];

			case Enum_Commands.NOTICE:
				return this.getModulesForPrivateMessage(message);

			case Enum_Commands.OPER:
				return [this.getModuleByType(Enum_ModuleTypes.OPERATORS)];

			case Enum_Commands.PART:
				return [this.getModuleByType(Enum_ModuleTypes.CHANNELS)];

			case Enum_Commands.PASS:
				return [
					// For clients:
					this.getModuleByType(Enum_ModuleTypes.AUTHENTICATION),
					// For servers:
					this.getModuleByType(Enum_ModuleTypes.NETWORK)
				];

			case Enum_Commands.PING:
				return [this.getModuleByType(Enum_ModuleTypes.PINGS)];

			case Enum_Commands.PONG:
				return [this.getModuleByType(Enum_ModuleTypes.PINGS)];

			case Enum_Commands.PRIVMSG:
				return this.getModulesForPrivateMessage(message);

			case Enum_Commands.QUIT:
				return [this.getModuleByType(Enum_ModuleTypes.USERS)];

			case Enum_Commands.RESTART:
				return [this.getModuleByType(Enum_ModuleTypes.OPERATORS)];

			case Enum_Commands.SERVER:
				return [this.getModuleByType(Enum_ModuleTypes.NETWORK)];

			case Enum_Commands.TOPIC:
				return [this.getModuleByType(Enum_ModuleTypes.CHANNELS)];

			case Enum_Commands.USER:
				return [this.getModuleByType(Enum_ModuleTypes.AUTHENTICATION)];

			case Enum_Commands.WHOIS:
				return [this.getModuleByType(Enum_ModuleTypes.USERS)];

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
			add(this.getModuleByType(Enum_ModuleTypes.CHANNELS)).to(modules);
		}

		if (message.hasUserMessageTargets()) {
			add(
				this.getModuleByType(Enum_ModuleTypes.PRIVATE_MESSAGES)
			).to(modules);
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
			case Enum_TargetTypes.CHANNEL:
				add(this.getModuleByType(Enum_ModuleTypes.CHANNELS)).to(modules);
				break;

			case Enum_TargetTypes.USER:
				add(this.getModuleByType(Enum_ModuleTypes.USERS)).to(modules);
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
		var message = Message.fromReply(reply);

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

	/**
	 * @returns {boolean}
	 */
	hasPort() {
		return this.getPort() !== null;
	}

	setHostname(hostname) {
		this.getServerDetails().setHostname(hostname);
		return this;
	}

	setPassword(password) {
		this.getServerDetails().setPassword(password);
		return this;
	}

	setName(name) {
		this.getServerDetails().setName(name);
		return this;
	}

	setMotd(motd) {
		this.getServerDetails().setMotd(motd);
		return this;
	}

	/**
	 * @returns {string}
	 */
	getHostname() {
		return this.getServerDetails().getHostname();
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

	getClientForUserDetails(user_details) {
		if (user_details.hasUserId()) {
			let user_id = user_details.getUserId();

			return this.getClientForUserId(user_id);
		}

		if (user_details.hasNickname()) {
			let nickname = user_details.getNickname();

			return this.getClientForNickname(nickname);
		}

		return null;
	}

	getClientsForUserDetails(user_details) {
		if (!user_details.hasMask()) {
			let client = this.getClientForUserDetails(user_details);

			if (client) {
				return [client];
			} else {
				return [ ];
			}
		}

		return this.getClientConnections().filter(function filter(client) {
			return client.getUserDetails().matches(user_details);
		});
	}

	getClientForUserId(user_id) {
		var
			clients = this.getClientConnections(),
			index   = 0;

		while (index < clients.length) {
			let client = clients[index];

			if (client.getUserDetails().getUserId() === user_id) {
				return client;
			}

			index++;
		}

		return null;
	}

	getClientForNickname(nickname) {
		var
			clients = this.getClientConnections(),
			index   = 0;

		while (index < clients.length) {
			let client = clients[index];

			if (client.getUserDetails().getNickname() === nickname) {
				return client;
			}

			index++;
		}
	}

	getClientConnections() {
		return this.connections.filter(function filter(connection) {
			return connection.isClientConnection();
		});
	}

	getServerConnections() {
		return this.connections.filter(function filter(connection) {
			return connection.isServerConnection();
		});
	}

	getPendingConnections() {
		return this.connections.filter(function filter(connection) {
			return connection.isPendingConnection();
		});
	}

	/**
	 * @param   {function} callback
	 * @returns {void}
	 */
	destroy(callback) {
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

		this.connections.forEach(function each(connection) {
			chain.andCall(connection.disconnectSafe);
			chain.bind(connection);
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

	setLogIncomingMessages(log_incoming_messages) {
		this.log_incoming_messages = log_incoming_messages;
		return this;
	}

	shouldLogIncomingMessages() {
		return this.log_incoming_messages;
	}

	setLogOutgoingMessages(log_outgoing_messages) {
		this.log_outgoing_messages = log_outgoing_messages;
		return this;
	}

	shouldLogOutgoingMessages() {
		return this.log_outgoing_messages;
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
	 * @returns {object}
	 */
	getDefaultConnectionParameters() {
		return {
			hostname: 'localhost',
			port:     6667
		};
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

			this.coupleToConnection(server_connection);

			return void callback(null);
		}

		try {
			server_connection = new Server_Connection_Server();
			server_connection.connect(parameters, handleConnected.bind(this));
		} catch (error) {
			deferOrThrow(callback, error);
		}
	}

}

extend(Server.prototype, {

	connections:            null,

	modules:                null,
	server_details:         null,

	is_destroyed:           false,
	is_destroying:          false,
	destruction_callbacks:  null,
	log_incoming_messages:  false,
	log_outgoing_messages:  false,
	outgoing_message_count: 0,

	port:                   null,
	raw_server:             null

});

module.exports = Server;
