
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
	ServiceRegistry             = req('/lib/server/registries/services'),
	ServiceTypes                = req('/constants/service-types'),
	UserModes                   = req('/constants/user-modes'),
	ChannelModes                = req('/constants/channel-modes');

var
	AuthService       = req('/lib/server/services/auth'),
	ChannelService    = req('/lib/server/services/channel'),
	PMService         = req('/lib/server/services/pm'),
	NickService       = req('/lib/server/services/nick'),
	UserService       = req('/lib/server/services/user'),
	PingService       = req('/lib/server/services/ping'),
	ServerInfoService = req('/lib/server/services/server-info');

var
	NotYetImplementedError  = req('/lib/errors/not-yet-implemented'),
	AlreadyListeningError   = req('/lib/errors/already-listening'),
	InvalidServiceTypeError = req('/lib/errors/invalid-service-type');


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

	initServices() {
		this.addService(new AuthService());
		this.addService(new ChannelService());
		this.addService(new PMService());
		this.addService(new NickService());
		this.addService(new UserService());
		this.addService(new PingService());
		this.addService(new ServerInfoService());
	}

	addService(service) {
		var service_registry = this.getServiceRegistry();

		service.setClientRegistry(this.getClientRegistry());
		service.setServerDetails(this.getServerDetails());
		service.setServiceRegistry(service_registry);

		service_registry.addService(service);
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

		var services = this.getServicesForCommandMessage(message);

		if (services === null || services.length === 0) {
			throw new NotYetImplementedError(`
				handling for command: ${message.command}
			`);
		}

		services.forEach(function each(service) {
			service.handleClientMessage(client, message);
		});
	}

	handleClientConnectionEnd(client) {
		this.getClientRegistry().removeClient(client);

		this.getServices().forEach(function each(service) {
			service.decoupleFromClient(client);
		});

		client.removeAllListeners();
	}

	registerClient(client) {
		client.setIsRegistering(true);

		var
			services = this.getServices(),
			index    = 0;

		function advance() {
			var service = services[index];

			index++;

			function handler(error) {
				if (error) {
					return void this.handleClientRegistrationFailure(
						error,
						client
					);
				}

				if (index === services.length) {
					return void this.handleClientRegistrationSuccess(client);
				}

				advance.call(this);
			}

			service.registerClient(client, handler.bind(this));
		}

		advance.call(this);
	}

	handleClientRegistrationSuccess(client) {
		client.setIsRegistering(false);
		client.setHasRegistered(true);

		this.getClientRegistry().addClient(client);

		this.getServices().forEach(function each(service) {
			service.coupleToClient(client);
		});
	}

	handleClientRegistrationFailure(error, client) {
		client.setIsRegistering(false);
		client.setHasRegistered(false);
	}

	getServicesForCommandMessage(message) {
		var command = message.getCommand();

		switch (command) {
			case Commands.JOIN:
			case Commands.PART:
			case Commands.NAMES:
			case Commands.TOPIC:
				return [this.getServiceByType(ServiceTypes.CHANNEL)];

			case Commands.PING:
			case Commands.PONG:
				return [this.getServiceByType(ServiceTypes.PING)];

			case Commands.USER:
				return [this.getServiceByType(ServiceTypes.USER)];

			case Commands.NICK:
				return [this.getServiceByType(ServiceTypes.NICK)];

			case Commands.MODE:
				return this.getServicesForModeMessage(message);

			case Commands.PRIVMSG:
			case Commands.NOTICE:
				return this.getServicesForPrivateMessage(message);

			case Commands.WHOIS:
				return [this.getServiceByType(ServiceTypes.USER)];

			default:
				return null;
		}
	}

	getServicesForPrivateMessage(message) {
		var services = [ ];

		if (message.hasChannelTarget()) {
			add(this.getServiceByType(ServiceTypes.CHANNEL)).to(services);
		}

		if (message.hasUserTarget()) {
			add(this.getServiceByType(ServiceTypes.PM)).to(services);
		}

		return services;
	}

	getServicesForModeMessage(message) {
		var services = [ ];

		if (message.hasChannelTarget()) {
			add(this.getServiceByType(ServiceTypes.CHANNEL)).to(services);
		}

		if (message.hasUserTarget()) {
			add(this.getServiceByType(ServiceTypes.USER)).to(services);
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

	getServices() {
		return this.getServiceRegistry().getServices();
	}

	getServiceByType(service_type) {
		if (!has(ServiceTypes, service_type)) {
			throw new InvalidServiceTypeError(service_type);
		}

		return this.getServiceRegistry().getServiceByType(service_type);
	}

	getServiceRegistry() {
		if (!this.service_registry) {
			this.service_registry = new ServiceRegistry();
		}

		return this.service_registry;
	}

	destroy() {
		if (this.destroyed) {
			return;
		}

		this.getServices().forEach(function each(service) {
			service.destroy();
		});

		this.clients.forEach(function each(client) {
			client.destroy();
		});

		this.close();
		this.destroyed = true;
	}

}

extend(Server.prototype, {

	clients:          null,
	services:         null,
	server_details:   null,
	client_registry:  null,
	service_registry: null,

	destroyed:        false

});

module.exports = Server;
