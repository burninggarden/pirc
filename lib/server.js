var req = require('req');

var
	extend = req('/utilities/extend'),
	Net    = require('net');

var
	SettersInterface             = req('/lib/server/interfaces/setters'),
	ValidationInterface          = req('/lib/server/interfaces/validation'),
	ClientConnection             = req('/lib/server/client-connection'),
	ClientConnectionEvents       = req('/lib/server/client-connection/constants/events'),
	NumericRepliesToConstructors = req('/mappings/numeric-replies-to-constructors'),
	Commands                     = req('/constants/commands');

var
	AuthService    = req('/lib/server/services/auth'),
	ChannelService = req('/lib/server/services/channels'),
	NickService    = req('/lib/server/services/nicks'),
	UserService    = req('/lib/server/services/users'),
	PingService    = req('/lib/server/services/pings');

var
	NotYetImplementedError = req('/lib/errors/not-yet-implemented');

class Server extends Net.Server {

	constructor() {
		super();

		this.client_connections = [ ];

		this.bindHandlers();
		this.initServices();
	}

	bindHandlers() {
		this.handleConnection = this.handleConnection.bind(this);
		this.handleClose      = this.handleClose.bind(this);
		this.handleError      = this.handleError.bind(this);

		this.on('connection', this.handleConnection);
		this.on('close', this.handleClose);
		this.on('error', this.handleError);
	}

	initServices() {
		this.auth_service    = new AuthService();
		this.channel_service = new ChannelService();
		this.nick_service    = new NickService();
		this.user_service    = new UserService();
		this.ping_service    = new PingService();

		this.services = [
			this.auth_service,
			this.channel_service,
			this.nick_service,
			this.user_service,
			this.ping_service
		];
	}

	handleConnection(socket) {
		var client_connection = new ClientConnection(socket);

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

		this.services.forEach(function each(service) {
			service.registerClient(client_connection);
		});
	}

	handleClientConnectionMessage(client_connection, message) {
		if (message.hasNumericReply()) {
			return this.sendMessageToClientViaNumericReply(
				client_connection,
				message.getNumericReply()
			);
		}

		var service = this.getServiceForCommand(message.command);

		if (!service) {
			throw new NotYetImplementedError('handling for command: ' + message.command);
		}

		service.handleClientMessage(client_connection, message);
	}

	handleClientConnectionEnd(client_connection) {
		this.services.forEach(function each(service) {
			service.unregisterClient(client_connection);
		});
	}

	getServiceForCommand(command) {
		switch (command) {
			case Commands.JOIN:
			case Commands.PART:
				return this.channel_service;

			case Commands.USER:
				return this.user_service;
			case Commands.NICK:
				return this.nick_service;

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

	sendMessageToClientViaNumericReply(client, numeric_reply) {
		var message = this.createMessageForNumericReply(numeric_reply);

		client.sendMessage(message);

		return this;
	}

	createMessageForNumericReply(numeric_reply) {
		if (NumericRepliesToConstructors[numeric_reply] === undefined) {
			throw new NotYetImplementedError('handler for numeric reply: ' + numeric_reply);
		}

		var constructor = NumericRepliesToConstructors[numeric_reply];

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

extend(Server.prototype, SettersInterface);
extend(Server.prototype, ValidationInterface);

extend(Server.prototype, {

	port:     null,
	services: null

});

module.exports = Server;
