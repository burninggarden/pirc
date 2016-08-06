var req = require('req');

var
	defer  = req('/utilities/defer'),
	extend = req('/utilities/extend');

var
	EventEmitter = require('events').EventEmitter;

var
	ServerConnection        = req('/lib/client/server-connection'),
	ServerConnectionEvents  = req('/lib/client/server-connection/constants/events'),
	NoServerConnectionError = req('/lib/errors/no-server-connection');


class Client extends EventEmitter {

	constructor() {
		super();

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

		server_connection.on(
			ServerConnectionEvents.CONNECTION_FAILURE,
			this.handleServerConnectionFailure.bind(this, server_connection)
		);

		server_connection.on(
			ServerConnectionEvents.CONNECTION_END,
			this.handleServerConnectionEnd.bind(this, server_connection)
		);
	}

	hasNoServerConnections() {
		return this.server_connections.length === 0;
	}

	getCurrentServerConnection() {
		return this.current_server_connection;
	}

	joinChannel(channel_name, callback) {
		if (this.hasNoServerConnections()) {
			let error = new NoServerConnectionError(channel_name);

			return void defer(callback, error);
		}

		var connection = this.getCurrentServerConnection();

		return connection.joinChannelByName(channel_name, callback);
	}

	leaveChannel(channel_name, callback) {
		if (this.hasNoServerConnections()) {
			let error = new NoServerConnectionError(channel_name);

			return void defer(callback, error);
		}

		var connection = this.getCurrentServerConnection();

		return connection.leaveChannelByName(channel_name, callback);
	}

	sendMessageToChannel(message, channel_name) {
		if (this.hasNoServerConnections()) {
			throw new NoServerConnectionError(channel_name);
		}

		var connection = this.getCurrentServerConnection();

		return connection.sendTextToChannelByName(message, channel_name);
	}

	handleServerConnectionPing(server_connection, message) {
		server_connection.sendPongMessage();
	}

	handleServerConnectionSuccess(server_connection) {
		server_connection.sendRegistrationMessages();
	}

	handleServerConnectionFailure(server_connection) {
		throw new Error('implement');
	}

	handleServerConnectionEnd(server_connection) {
		this.emit('disconnect');
	}

}

extend(Client.prototype, {
	servers:                   null,
	current_server_connection: null
});

module.exports = Client;
