var req = require('req');

var
	deferOrThrow = req('/utilities/defer-or-throw'),
	extend       = req('/utilities/extend'),
	isString     = req('/utilities/is-string');

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
			return void deferOrThrow(callback, error);
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

		server_connection.on(
			ServerConnectionEvents.INCOMING_MESSAGE,
			this.handleServerConnectionMessage.bind(this, server_connection)
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

			return void deferOrThrow(callback, error);
		}

		var connection = this.getCurrentServerConnection();

		return connection.joinChannelByName(channel_name, callback);
	}

	leaveChannel(channel, callback) {
		var channel_name = this.normalizeChannelName(channel);

		if (this.hasNoServerConnections()) {
			let error = new NoServerConnectionError(channel_name);

			return void deferOrThrow(callback, error);
		}

		var connection = this.getCurrentServerConnection();

		return connection.leaveChannelByName(channel_name, callback);
	}

	sendMessageToChannel(message, channel) {
		var channel_name = this.normalizeChannelName(channel);

		if (this.hasNoServerConnections()) {
			throw new NoServerConnectionError(channel_name);
		}

		var connection = this.getCurrentServerConnection();

		return connection.sendTextToChannelByName(message, channel_name);
	}

	sendMessageToNick(message, nick) {
		if (this.hasNoServerConnections()) {
			throw new NoServerConnectionError(nick);
		}

		var connection = this.getCurrentServerConnection();

		return connection.sendTextToClientByNick(message, nick);
	}

	setTopicForChannel(topic, channel) {
		if (this.hasNoServerConnections()) {
			throw new NoServerConnectionError(channel_name);
		}

		var
			connection   = this.getCurrentServerConnection(),
			channel_name = this.normalizeChannelName(channel);

		return connection.setTopicForChannelByName(topic, channel_name);
	}

	performWhoisQueryForNick(nick, callback) {
		if (this.hasNoServerConnections()) {
			let error = new NoServerConnectionError(nick);

			return void deferOrThrow(callback, error);
		}

		var
			connection = this.getCurrentServerConnection();

		connection.performWhoisQueryForNick(nick);
	}

	normalizeChannelName(channel) {
		if (isString(channel)) {
			return channel;
		} else {
			return channel.getChannelDetails().getName();
		}
	}

	respondToMessage(message, body) {
		if (message.hasChannel()) {
			this.respondToChannelMessage(message, body);
		} else if (message.hasClient()) {
			this.respondToClientMessage(message, body);
		}
	}

	respondToChannelMessage(message, body) {
		var channel = message.getChannelName();

		this.sendMessageToChannel(body, channel);
	}

	respondToClientMessage(message, body) {
		var nick = message.getNick();

		this.sendMessageToNick(body, nick);
	}

	handleServerConnectionPing(server_connection, message) {
		server_connection.sendPongMessage();
	}

	handleServerConnectionSuccess(server_connection) {
		server_connection.sendRegistrationMessages();
	}

	handleServerConnectionFailure(server_connection, error) {
		throw new Error('implement');
	}

	handleServerConnectionEnd(server_connection) {
		this.emit('disconnect');
	}

	handleServerConnectionMessage(server_connection, message_event) {
		this.emit('message', message_event);
	}

	destroy() {
		this.server_connections.forEach(function each(server_connection) {
			server_connection.destroy();
		});

		this.servers = null;
		this.current_server_connection = null;
	}

}

extend(Client.prototype, {
	servers:                   null,
	current_server_connection: null
});

module.exports = Client;
