
var
	add          = req('/utilities/add'),
	remove       = req('/utilities/remove'),
	deferOrThrow = req('/utilities/defer-or-throw'),
	extend       = req('/utilities/extend'),
	isString     = req('/utilities/is-string');

var
	EventEmitter = require('events').EventEmitter;

var
	Delimiters = req('/lib/constants/delimiters');

var
	ServerConnection        = req('/lib/client/server-connection'),
	ServerConnectionEvents  = req('/lib/client/server-connection/constants/events'),
	NoServerConnectionError = req('/lib/errors/no-server-connection'),
	ChannelNameValidator    = req('/validators/channel-name'),
	MessageGenerator        = req('/lib/client/message-generator');


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

			this.coupleToServerConnection(server_connection);
			this.current_server_connection = server_connection;

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

			return void server_connection.connect(handler.bind(this));
		} catch (error) {
			return void deferOrThrow(callback, error);
		}
	}

	coupleToServerConnection(server_connection) {
		add(server_connection).to(this.server_connections);

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

	decoupleFromServerConnection(server_connection) {
		server_connection.removeAllListeners();

		remove(server_connection).from(this.server_connections);

		if (this.current_server_connection === server_connection) {
			this.current_server_connection = null;
		}
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
		if (isString(channel_name)) {
			try {
				ChannelNameValidator.validate(channel_name);
			} catch (error) {
				return void deferOrThrow(callback, error);
			}
		}

		if (this.hasNoServerConnections()) {
			let error = new NoServerConnectionError(channel_name);

			return void deferOrThrow(callback, error);
		}

		var connection = this.getCurrentServerConnection();

		return connection.joinChannelName(channel_name, callback);
	}

	joinChannels(channel_names, callback) {
		var
			index    = 0,
			done     = false,
			channels = [ ];

		function handler(error, channel) {
			if (done) {
				return;
			}

			if (error) {
				done = true;
				return void deferOrThrow(callback, error);
			}

			channels.push(channel);

			if (channels.length === channel_names.length) {
				done = true;

				if (callback) {
					return void callback(null, channels);
				}
			}
		}

		while (index < channel_names.length) {
			let channel_name = channel_names[index];

			index++;

			try {
				this.joinChannel(channel_name, handler);
			} catch (error) {
				return void deferOrThrow(callback, error);
			}
		}
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

	getRandomChannelDetails() {
		var channel = this.getRandomChannel();

		if (!channel) {
			return null;
		}

		return channel.getChannelDetails();
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

		return connection.sendTextToUserByNick(message, nick);
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

	handleServerConnectionSuccess(server_connection) {
		// TODO: something here
	}

	handleServerConnectionFailure(server_connection, error) {
		this.emit('error', error);
	}

	handleServerConnectionEnd(server_connection) {
		this.decoupleFromServerConnection(server_connection);
	}

	handleServerConnectionMessage(server_connection, message_event) {
		this.emit('message', message_event);
	}

	destroy() {
		this.server_connections.forEach(function each(server_connection) {
			server_connection.destroy();
		});

		this.server_connections = null;
		this.current_server_connection = null;
	}

	sendRandomCommandMessage() {
		if (this.hasNoServerConnections()) {
			return;
		}

		var message = MessageGenerator.generateRandomMessageForClient(this);

		this.getCurrentServerConnection().sendMessage(message);
	}

	getUserDetails() {
		if (this.hasNoServerConnections()) {
			return null;
		}

		return this.getCurrentServerConnection().getUserDetails();
	}

	sendRawMessage(text) {
		if (this.hasNoServerConnections()) {
			throw new NoServerConnectionError();
		}

		if (text.slice(-2) !== Delimiters.CRLF) {
			text += Delimiters.CRLF;
		}

		this.getCurrentServerConnection().write(text);
	}

}

extend(Client.prototype, {
	server_connections:        null,
	current_server_connection: null
});

module.exports = Client;
