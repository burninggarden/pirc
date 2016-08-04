var req = require('req');

var
	defer  = req('/utilities/defer'),
	extend = req('/utilities/extend');

var
	ServerConnection        = req('/lib/client/server-connection'),
	ServerConnectionEvents  = req('/lib/client/server-connection/constants/events'),
	NoServerConnectionError = req('/lib/errors/no-server-connection');

class Client {

	constructor() {
		this.server_connections = [ ];
	}

	connectToServer(parameters, callback) {
		try {
			let server_connection = new ServerConnection(parameters);

			this.coupleToServerConnection(server_connection);

			this.current_server_connection = server_connection;

			return server_connection.connect(callback);
		} catch (error) {
			return void defer(callback, error);
		}
	}

	coupleToServerConnection(server_connection) {
		this.server_connections.push(server_connection);

		server_connection.on(
			ServerConnectionEvents.PING,
			this.handleServerConnectionPing.bind(this, server_connection)
		);

		server_connection.on(
			ServerConnectionEvents.CONNECTION_SUCCESS,
			this.handleServerConnectionSuccess.bind(this, server_connection)
		);
	}

	hasNoServerConnections() {
		return this.server_connections.length === 0;
	}

	getCurrentServerConnection() {
		return this.current_server_connection;
	}

	joinChannel(channel, callback) {
		if (this.hasNoServerConnections()) {
			return void defer(callback, new NoServerConnectionError(channel));
		}

		return this.getCurrentServerConnection().joinChannel(channel, callback);
	}

	leaveChannel(channel, callback) {
		if (this.hasNoServerConnections()) {
			return void defer(callback, new NoServerConnectionError(channel));
		}

		return this.getCurrentServerConnection().leaveChannel(channel, callback);
	}

	handleServerConnectionPing(server_connection, message) {
		server_connection.sendPongMessage();
	}

	handleServerConnectionSuccess(server_connection) {
		server_connection.sendRegistrationMessages();
	}

}

extend(Client.prototype, {
	servers:                   null,
	current_server_connection: null
});

module.exports = Client;
