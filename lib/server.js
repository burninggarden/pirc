var req = require('req');

var
	extend = req('/utilities/extend'),
	Net    = require('net');

var
	ClientConnection            = req('/lib/server/client-connection'),
	ClientConnectionEvents      = req('/lib/server/client-connection/constants/events'),
	ReplyNumericsToConstructors = req('/mappings/reply-numerics-to-constructors'),
	Commands                    = req('/constants/commands'),
	ServerDetails               = req('/lib/server-details'),
	ClientRegistry              = req('/lib/server/registries/clients');

var
	AuthService       = req('/lib/server/services/auth'),
	ChannelService    = req('/lib/server/services/channels'),
	PMService         = req('/lib/server/services/pms'),
	NickService       = req('/lib/server/services/nicks'),
	UserService       = req('/lib/server/services/users'),
	PingService       = req('/lib/server/services/pings'),
	MotdService       = req('/lib/server/services/motd'),
	ServerInfoService = req('/lib/server/services/server-info');

var
	NotYetImplementedError = req('/lib/errors/not-yet-implemented'),
	AlreadyListeningError  = req('/lib/errors/already-listening');


const
	DEFAULT_SERVER_NAME = 'πrc Internet Relay Chat server';

class Server extends Net.Server {

	constructor(parameters) {
		super();

		this.client_connections = [ ];

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
		this.initServices();
	}

	bindHandlers() {
		this.handleConnection = this.handleConnection.bind(this);
		this.handleClose      = this.handleClose.bind(this);
		this.handleError      = this.handleError.bind(this);

		this.on('connection', this.handleConnection);
		this.on('close',      this.handleClose);
		this.on('error',      this.handleError);
	}

	initServices() {
		this.auth_service        = new AuthService();
		this.channel_service     = new ChannelService();
		this.pm_service          = new PMService();
		this.nick_service        = new NickService();
		this.user_service        = new UserService();
		this.ping_service        = new PingService();
		this.motd_service        = new MotdService();
		this.server_info_service = new ServerInfoService();

		this.services = [
			this.auth_service,
			this.channel_service,
			this.pm_service,
			this.nick_service,
			this.user_service,
			this.ping_service,
			this.motd_service,
			this.server_info_service
		];

		this.services.forEach(function each(service) {
			service.setClientRegistry(this.getClientRegistry());
			service.setServerDetails(this.getServerDetails());
		}, this);
	}

	handleConnection(socket) {
		var client_connection = new ClientConnection(socket);

		client_connection.setServerDetails(this.getServerDetails());

		this.client_connections.push(client_connection);
		this.coupleToClientConnection(client_connection);
	}

	coupleToClientConnection(client_connection) {
		client_connection.on(
			ClientConnectionEvents.INCOMING_MESSAGE,
			this.handleClientConnectionMessage.bind(this, client_connection)
		);

		client_connection.on(
			ClientConnectionEvents.CONNECTION_END,
			this.handleClientConnectionEnd.bind(this, client_connection)
		);

		client_connection.on(
			ClientConnectionEvents.MESSAGE_ERROR,
			this.handleClientConnectionMessageError.bind(this, client_connection)
		);

		client_connection.on(
			ClientConnectionEvents.REGISTER,
			this.handleClientConnectionRegistered.bind(this, client_connection)
		);
	}

	handleClientConnectionMessage(client_connection, message) {
		if (!client_connection.hasRegistered()) {
			return this.handleUnregisteredClientConnectionMessage(
				client_connection,
				message
			);
		}

		var services = this.getServicesForCommandMessage(message);

		if (services === null || services.length === 0) {
			throw new NotYetImplementedError(`
				handling for command: ${message.command}
			`);
		}

		services.forEach(function each(service) {
			service.handleClientMessage(client_connection, message);
		});
	}

	/**
	 * Handle a message from a client that hasn't successfully registered.
	 * This should never happen, because messages are queued by the client
	 * until it determines that it has received the requisite registration
	 * messages.
	 *
	 * @param   {lib/server/client-connection} client_connection
	 * @param   {lib/client/message}           message
	 * @returns {void}
	 */
	handleUnregisteredClientConnectionMessage(client_connection, message) {
		throw new NotYetImplementedError(`
			Return notice message to the client indicating this
			command won't be processed until they are registered
		`);
	}

	handleClientConnectionEnd(client_connection) {
		this.getClientRegistry().removeClient(client_connection);

		this.services.forEach(function each(service) {
			service.unregisterClient(client_connection);
		});
	}

	handleClientConnectionMessageError(client_connection, error) {
		// TODO: this
		console.error(error);
	}

	handleClientConnectionRegistered(client_connection) {
		this.getClientRegistry().addClient(client_connection);

		this.services.forEach(function each(service) {
			service.registerClient(client_connection);
		});
	}

	getServicesForCommandMessage(message) {
		var command = message.getCommand();

		switch (command) {
			case Commands.JOIN:
			case Commands.PART:
			case Commands.NAMES:
			case Commands.TOPIC:
				return [this.channel_service];

			case Commands.PING:
			case Commands.PONG:
				return [this.ping_service];

			case Commands.USER:
				return [this.user_service];

			case Commands.NICK:
				return [this.nick_service];

			case Commands.PRIVMSG:
				return this.getServicesForPrivateMessage(message);

			case Commands.WHOIS:
				return [this.user_service];

			default:
				return null;
		}
	}

	getServicesForPrivateMessage(message) {
		var services = [ ];

		if (message.hasChannelTarget()) {
			services.push(this.channel_service);
		}

		if (message.hasUserTarget()) {
			services.push(this.pm_service);
		}

		return services;
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

	destroy() {
		if (this.destroyed) {
			return;
		}

		this.services.forEach(function each(service) {
			service.destroy();
		});

		this.client_connections.forEach(function each(client_connection) {
			client_connection.destroy();
		});

		this.close();
		this.destroyed = true;
	}

}

extend(Server.prototype, {

	services:        null,
	server_details:  null,
	client_registry: null,

	destroyed:       false

});

module.exports = Server;
