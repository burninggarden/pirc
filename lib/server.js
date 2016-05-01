var req = require('req');

var
	extend = req('/utilities/extend'),
	Net    = require('net');

var
	SettersInterface            = req('/lib/server/interfaces/setters'),
	ValidationInterface         = req('/lib/server/interfaces/validation'),
	ClientConnection            = req('/lib/server/client-connection'),
	ClientConnectionEvents      = req('/lib/server/client-connection/constants/events'),
	ResponseTypesToConstructors = req('/mappings/response-types-to-constructors'),
	Commands                    = req('/constants/commands');

var
	AuthService = req('/lib/server/services/auth'),
	NickService = req('/lib/server/services/nick'),
	UserService = req('/lib/server/services/user');

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
		this.auth_service = new AuthService();
		this.nick_service = new NickService();
		this.user_service = new UserService();
	}

	handleConnection(socket) {
		var client_connection = new ClientConnection(socket);

		this.client_connections.push(client_connection);
		this.coupleToClientConnection(client_connection);
	}

	coupleToClientConnection(client_connection) {
		client_connection.on(
			ClientConnectionEvents.INCOMING_MESSAGE,
			this.handleClientMessage.bind(this, client_connection)
		);

		this.auth_service.sendInitialNoticeToClient(client_connection);
	}

	handleClientMessage(client, message) {
		if (message.hasResponseType()) {
			return this.sendResponseTypeToClient(message.getResponseType(), client);
		}

		var service = this.getServiceForCommand(message.command);

		if (!service) {
			throw new NotYetImplementedError('handling for command: ' + message.command);
		}

		service.handleClientMessage(client, message);
	}

	getServiceForCommand(command) {
		switch (command) {
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

	sendResponseTypeToClient(response_type, client) {
		var message = this.createMessageForResponseType(response_type);

		client.sendMessage(message);

		return this;
	}

	createMessageForResponseType(response_type) {
		if (ResponseTypesToConstructors[response_type] === undefined) {
			throw new NotYetImplementedError('handler for response type: ' + response_type);
		}

		var constructor = ResponseTypesToConstructors[response_type];

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


module.exports = Server;
