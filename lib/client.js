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
		var server_connection;

		function handler(error) {
			if (error) {
				return void callback(error);
			}



			if (parameters.await_registration === false) {
				return void callback(null, server_connection);
			}

			server_connection.once(
				ServerConnectionEvents.REGISTERED,
				function handler() {
					callback(null, server_connection);
				}
			);
		}

		try {
			server_connection = new ServerConnection(parameters);

			this.coupleToServerConnection(server_connection);
			this.current_server_connection = server_connection;

			return void server_connection.connect(handler.bind(this));
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

	isInChannel(channel_name) {
		if (this.hasNoServerConnections()) {
			return false;
		}

		var connection = this.getCurrentServerConnection();

		return connection.isWithinChannelName(channel_name);
	}

	joinChannel(channel_name, callback) {
		if (this.hasNoServerConnections()) {
			let error = new NoServerConnectionError(channel_name);

			return void deferOrThrow(callback, error);
		}

		var connection = this.getCurrentServerConnection();

		return connection.joinChannelName(channel_name, callback);
	}

	leaveChannel(channel, callback) {
		var channel_name = this.normalizeChannelName(channel);

		if (this.hasNoServerConnections()) {
			let error = new NoServerConnectionError(channel_name);

			return void deferOrThrow(callback, error);
		}

		var connection = this.getCurrentServerConnection();

		return connection.leaveChannelName(channel_name, callback);
	}

	getRandomChannel() {
		if (this.hasNoServerConnections()) {
			return null;
		}

		return this.getCurrentServerConnection().getRandomChannel();
	}

	sendMessageToChannel(message, channel) {
		var channel_name = this.normalizeChannelName(channel);

		if (this.hasNoServerConnections()) {
			throw new NoServerConnectionError(channel_name);
		}

		var connection = this.getCurrentServerConnection();

		return connection.sendTextToChannelName(message, channel_name);
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

		return connection.setTopicForChannelName(topic, channel_name);
	}

	sendWhoisQueryForNick(nick, callback) {
		if (this.hasNoServerConnections()) {
			let error = new NoServerConnectionError(nick);

			return void deferOrThrow(callback, error);
		}

		var connection = this.getCurrentServerConnection();

		connection.sendWhoisQueryForNick(nick, callback);
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
		this.emit('error', error);
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
