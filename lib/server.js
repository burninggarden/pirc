var req = require('req');

var
	extend = req('/utilities/extend'),
	Net    = require('net');

var
	AccessInterface             = req('/lib/server/interfaces/access'),
	ValidationInterface         = req('/lib/server/interfaces/validation'),
	ClientConnection            = req('/lib/server/client-connection'),
	ClientConnectionEvents      = req('/lib/server/client-connection/constants/events'),
	ReplyNumericsToConstructors = req('/mappings/reply-numerics-to-constructors'),
	Commands                    = req('/constants/commands');

var
	AuthService    = req('/lib/server/services/auth'),
	ChannelService = req('/lib/server/services/channels'),
	NickService    = req('/lib/server/services/nicks'),
	UserService    = req('/lib/server/services/users'),
	PingService    = req('/lib/server/services/pings'),
	MotdService    = req('/lib/server/services/motd');

var
	NotYetImplementedError = req('/lib/errors/not-yet-implemented');

class Server extends Net.Server {

	constructor(parameters) {
		super();

		this.client_connections = [ ];

		this.setName(parameters.name);

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
		this.auth_service    = new AuthService();
		this.channel_service = new ChannelService();
		this.nick_service    = new NickService();
		this.user_service    = new UserService();
		this.ping_service    = new PingService();
		this.motd_service    = new MotdService();

		this.services = [
			this.auth_service,
			this.channel_service,
			this.nick_service,
			this.user_service,
			this.ping_service,
			this.motd_service
		];

		this.services.forEach(function each(service) {
			service.setServerName(this.getName());
		}, this);
	}

	handleConnection(socket) {
		var client_connection = new ClientConnection(socket);

		client_connection.setServerName(this.getName());

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

		this.services.forEach(function each(service) {
			service.registerClient(client_connection);
		});
	}

	handleClientConnectionMessage(client_connection, message) {
		var service = this.getServiceForCommandMessage(message);

		if (!service) {
			throw new NotYetImplementedError(`
				handling for command: ${message.command}
			`);
		}

		service.handleClientMessage(client_connection, message);
	}

	handleClientConnectionEnd(client_connection) {
		this.services.forEach(function each(service) {
			service.unregisterClient(client_connection);
		});
	}

	handleClientConnectionMessageError(client_connection, error) {
		// TODO: this
		console.error(error);
	}

	getServiceForCommandMessage(message) {
		var command = message.getCommand();

		switch (command) {
			case Commands.JOIN:
			case Commands.PART:
			case Commands.NAMES:
				return this.channel_service;

			case Commands.PING:
			case Commands.PONG:
				return this.ping_service;

			case Commands.USER:
				return this.user_service;

			case Commands.NICK:
				return this.nick_service;

			case Commands.PRIVMSG:
				if (message.hasChannelName()) {
					return this.channel_service;
				} else {
					throw new Error('implement pms');
				}

			default:
				return null;
		}
	}

	handleClose() {
		throw new NotYetImplementedError();
	}

	handleError() {
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

	isListening() {
		return this.listening === true;
	}

}

extend(Server.prototype, AccessInterface);
extend(Server.prototype, ValidationInterface);

extend(Server.prototype, {

	port:     null,
	services: null,
	name:     null

});

module.exports = Server;
