var req = require('req');

var
	extend = req('/utilities/extend'),
	Net    = require('net');

var
	SettersInterface       = req('/lib/server/interfaces/setters'),
	ValidationInterface    = req('/lib/server/interfaces/validation'),
	ClientConnection       = req('/lib/server/client-connection'),
	ClientConnectionEvents = req('/lib/server/client-connection/constants/events');

var
	NotYetImplementedError = req('/lib/errors/not-yet-implemented');

class Server extends Net.Server {

	constructor() {
		super();

		this.client_connections = [ ];

		this.bindHandlers();
	}

	bindHandlers() {
		this.handleConnection = this.handleConnection.bind(this);
		this.handleClose      = this.handleClose.bind(this);
		this.handleError      = this.handleError.bind(this);

		this.on('connection', this.handleConnection);
		this.on('close', this.handleClose);
		this.on('error', this.handleError);
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
	}

	handleClientMessage(client, message) {
		throw new NotYetImplementedError();
	}

	handleClose() {
		throw new NotYetImplementedError();
	}

	handleError() {
		throw new NotYetImplementedError();
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
