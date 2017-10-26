
var
	add          = req('/lib/utilities/add'),
	has          = req('/lib/utilities/has'),
	remove       = req('/lib/utilities/remove'),
	deferOrThrow = req('/lib/utilities/defer-or-throw'),
	extend       = req('/lib/utilities/extend'),
	isString     = req('/lib/utilities/is-string'),
	isFunction   = req('/lib/utilities/is-function');

var
	EventEmitter = require('events').EventEmitter,
	Promix       = require('promix');

var
	Replies  = req('/lib/constants/replies'),
	Commands = req('/lib/constants/commands');

var
	ServerConnection     = req('/lib/client/server-connection'),
	ConnectionEvents     = req('/lib/constants/connection-events'),
	ChannelNameValidator = req('/lib/validators/channel-name'),
	MessageGenerator     = req('/lib/client/message-generator');


class Client extends EventEmitter {

	/**
	 * @param   {object} parameters
	 * @returns {void}
	 */
	constructor(parameters) {
		super();

		if (parameters.nickname) {
			this.setNickname(parameters.nickname);
		}

		if (parameters.username) {
			this.setUsername(parameters.username);
		}

		if (parameters.realname) {
			this.setRealname(parameters.realname);
		}

		if (parameters.password) {
			this.setPassword(parameters.password);
		}

		if (parameters.log_inbound_messages) {
			this.setLogInboundMessages(parameters.log_inbound_messages);
		}

		if (parameters.log_outbound_messages) {
			this.setLogOutboundMessages(parameters.log_outbound_messages);
		}

		if (parameters.autoregister === false) {
			this.setAutoregister(false);
		}

		this.server_connections = [ ];
	}

	/**
	 * @param   {object} parameters
	 * @param   {function} callback
	 * @returns {void}
	 */
	connectToServer(parameters, callback) {
		if (!isFunction(callback)) {
			throw new Error('Must supply a callback function');
		}

		var server_connection;

		function handleConnected(error) {
			if (error) {
				return void callback(error);
			}

			this.current_server_connection = server_connection;

			if (parameters.await_registration === false) {
				return void callback(null, server_connection);
			}

			function handleRegistrationSuccess() {
				server_connection.removeListener(
					ConnectionEvents.REGISTRATION_FAILURE,
					handleRegistrationFailure
				);

				return void callback(null, server_connection);
			}

			function handleRegistrationFailure(error) {
				server_connection.removeListener(
					ConnectionEvents.REGISTRATION_SUCCESS,
					handleRegistrationSuccess
				);

				return void callback(error, server_connection);
			}

			server_connection.once(
				ConnectionEvents.REGISTRATION_SUCCESS,
				handleRegistrationSuccess
			);

			server_connection.once(
				ConnectionEvents.REGISTRATION_FAILURE,
				handleRegistrationFailure
			);
		}

		parameters = extend(this.getDefaultConnectionParameters(), parameters);

		try {
			server_connection = new ServerConnection(parameters);
			server_connection.connect(handleConnected.bind(this));
		} catch (error) {
			return void deferOrThrow(callback, error);
		}

		this.coupleToServerConnection(server_connection);
	}

	/**
	 * @returns {object}
	 */
	getDefaultConnectionParameters() {
		var result = { };

		if (this.hasNickname()) {
			result.nickname = this.getNickname();
		}

		if (this.hasUsername()) {
			result.username = this.getUsername();
		}

		if (this.hasRealname()) {
			result.realname = this.getRealname();
		}

		if (this.hasPassword()) {
			result.password = this.getPassword();
		}

		result.log_inbound_messages  = this.shouldLogInboundMessages();
		result.log_outbound_messages = this.shouldLogOutboundMessages();
		result.autoregister          = this.shouldAutoregister();

		return result;
	}

	/**
	 * @param   {lib/client/server-connection} server_connection
	 * @returns {void}
	 */
	coupleToServerConnection(server_connection) {
		add(server_connection).to(this.server_connections);

		server_connection.on(
			ConnectionEvents.CONNECTION_SUCCESS,
			this.handleServerConnectionSuccess.bind(this, server_connection)
		);

		server_connection.on(
			ConnectionEvents.CONNECTION_FAILURE,
			this.handleServerConnectionFailure.bind(this, server_connection)
		);

		server_connection.on(
			ConnectionEvents.CONNECTION_END,
			this.handleServerConnectionEnd.bind(this, server_connection)
		);

		server_connection.on(
			ConnectionEvents.REGISTRATION_SUCCESS,
			this.handleServerConnectionRegistered.bind(this, server_connection)
		);

		server_connection.on(
			ConnectionEvents.INCOMING_MESSAGE,
			this.handleServerConnectionMessage.bind(this, server_connection)
		);
	}

	/**
	 * @param   {lib/client/server-connection} server_connection
	 * @returns {void}
	 */
	decoupleFromServerConnection(server_connection) {
		server_connection.removeAllListeners();

		remove(server_connection).from(this.server_connections);

		if (this.current_server_connection === server_connection) {
			this.current_server_connection = null;
		}
	}

	/**
	 * @returns {boolean}
	 */
	hasNoServerConnections() {
		return this.server_connections.length === 0;
	}

	/**
	 * @returns {lib/client/server-connection|null}
	 */
	getCurrentServerConnection() {
		return this.current_server_connection;
	}

	/**
	 * @returns {boolean}
	 */
	hasCurrentServerConnection() {
		return this.getCurrentServerConnection() !== null;
	}

	/**
	 * @param   {string} channel_name
	 * @returns {boolean}
	 */
	isInChannel(channel_name) {
		if (this.hasNoServerConnections()) {
			return false;
		}

		var connection = this.getCurrentServerConnection();

		return connection.isWithinChannelName(channel_name);
	}

	/**
	 * @param   {string} channel_name
	 * @param   {function} callback
	 * @returns {void}
	 */
	joinChannel(channel_name, callback) {
		return this.joinChannelWithKey(channel_name, null, callback);
	}

	/**
	 * @param   {string} channel_name
	 * @param   {string} key
	 * @param   {function} callback
	 * @returns {void}
	 */
	joinChannelWithKey(channel_name, key, callback) {
		if (isString(channel_name)) {
			try {
				ChannelNameValidator.validate(channel_name);
			} catch (error) {
				return void deferOrThrow(callback, error);
			}
		}

		if (this.hasNoServerConnections()) {
			let error = new Error('No existing server connection');

			return void deferOrThrow(callback, error);
		}

		var connection = this.getCurrentServerConnection();

		return connection.joinChannelNameWithKey(channel_name, key, callback);
	}

	/**
	 * @param   {string[]} channel_names
	 * @param   {function} callback
	 * @returns {void}
	 */
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

	/**
	 * @param   {lib/client/channel} channel
	 * @param   {function} callback
	 * @returns {void}
	 */
	leaveChannel(channel, callback) {
		var channel_name = this.normalizeChannelName(channel);

		if (this.hasNoServerConnections()) {
			let error = new Error('No existing server connection');

			return void deferOrThrow(callback, error);
		}

		var connection = this.getCurrentServerConnection();

		return connection.leaveChannelName(channel_name, callback);
	}

	setChannelKey(channel, key, callback) {
		var channel_name = this.normalizeChannelName(channel);

		if (this.hasNoServerConnections()) {
			let error = new Error('No existing server connection');

			return void deferOrThrow(callback, error);
		}

		var connection = this.getCurrentServerConnection();

		return connection.setKeyForChannelName(key, channel_name, callback);
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
			throw new Error(
				`No server connection when sending message to channel ${channel_name}`
			);
		}

		var connection = this.getCurrentServerConnection();

		return connection.sendTextToChannelName(message, channel_name);
	}

	sendMessageToNick(message, nick) {
		if (this.hasNoServerConnections()) {
			throw new Error(
				`No server connection when sending message to nick ${nick}`
			);
		}

		var connection = this.getCurrentServerConnection();

		return connection.sendTextToUserByNick(message, nick);
	}

	setTopicForChannel(topic, channel) {
		if (this.hasNoServerConnections()) {
			throw new Error(
				`No server connection when setting topic for channel ${channel_name}`
			);
		}

		var
			connection   = this.getCurrentServerConnection(),
			channel_name = this.normalizeChannelName(channel);

		return connection.setTopicForChannelName(topic, channel_name);
	}

	sendWhoisQueryForNick(nick, callback) {
		if (this.hasNoServerConnections()) {
			let error = new Error(
				`No server connection when sending WHOIS for nick ${nick}`
			);

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
		this.emit('connected', server_connection);
	}

	handleServerConnectionFailure(server_connection, error) {
		this.emit('error', error);
	}

	handleServerConnectionEnd(server_connection) {
		this.decoupleFromServerConnection(server_connection);
	}

	handleServerConnectionRegistered(server_connection) {
		this.emit('registered', server_connection);
	}

	handleServerConnectionMessage(server_connection, message) {
		if (message.hasCommand()) {
			this.handleServerConnectionCommandMessage(
				server_connection,
				message
			);
		} else if (message.hasReply()) {
			this.handleServerConnectionReplyMessage(
				server_connection,
				message
			);
		}

		this.emit('raw_message', message);
	}

	handleServerConnectionCommandMessage(server_connection, message) {
	}

	handleServerConnectionReplyMessage(server_connection, message) {
	}

	destroy(callback) {
		var chain = Promix.chain();

		this.server_connections.forEach(function each(server_connection) {
			chain.andCall(server_connection.disconnectSafe);
			chain.bind(server_connection);
		});

		chain.then(function finisher() {
			this.server_connections = null;
			this.current_server_connection = null;

			callback(null);
		}).bind(this);

		chain.otherwise(callback);
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

	sendRawMessage(raw_message) {
		if (this.hasNoServerConnections()) {
			throw new Error('No server connection');
		}

		this.getCurrentServerConnection().sendRawMessage(raw_message);
	}

	awaitReply(reply, callback) {
		if (!has(Replies, reply)) {
			throw new Error('Invalid reply: ' + reply);
		}

		function handleMessage(message) {
			if (message.getReply() === reply) {
				this.removeListener('raw_message', handleMessage);
				callback(message);
			}
		}

		this.on('raw_message', handleMessage.bind(this));
	}

	awaitCommand(command, callback) {
		if (!has(Commands, command)) {
			throw new Error('Invalid command: ' + command);
		}

		function handleMessage(message) {
			if (message.getCommand() === command) {
				this.removeListener('raw_message', handleMessage);
				callback(message);
			}
		}

		this.on('raw_message', handleMessage.bind(this));
	}

	setNickname(nickname) {
		this.nickname = nickname;

		return this;
	}

	changeNickname(nickname, callback) {
		if (!this.hasCurrentServerConnection()) {
			throw new Error('No current server connection');
		}

		this.getCurrentServerConnection().changeNickname(nickname, callback);
		return this;
	}

	getNickname() {
		return this.nickname;
	}

	hasNickname() {
		return this.getNickname() !== null;
	}

	setUsername(username) {
		this.username = username;
		return this;
	}

	getUsername() {
		return this.username;
	}

	hasUsername() {
		return this.getUsername() !== null;
	}

	setRealname(realname) {
		this.realname = realname;
		return this;
	}

	getRealname() {
		return this.realname;
	}

	hasRealname() {
		return this.getRealname() !== null;
	}

	setPassword(password) {
		this.password = password;
		return this;
	}

	getPassword() {
		return this.password;
	}

	hasPassword() {
		return this.getPassword() !== null;
	}

	setLogInboundMessages(log_inbound_messages) {
		this.log_inbound_messages = log_inbound_messages;
		return this;
	}

	shouldLogInboundMessages() {
		return this.log_inbound_messages;
	}

	setLogOutboundMessages(log_outbound_messages) {
		this.log_outbound_messages = log_outbound_messages;
		return this;
	}

	shouldLogOutboundMessages() {
		return this.log_outbound_messages;
	}

	setAutoregister(autoregister) {
		this.autoregister = autoregister;
		return this;
	}

	shouldAutoregister() {
		return this.autoregister;
	}

	registerAsOperator(username, password, callback) {
		if (!this.hasCurrentServerConnection()) {
			return void callback(new Error('No current server connection'));
		}

		var connection = this.getCurrentServerConnection();

		connection.registerAsOperator(username, password, callback);
	}

	addUserMode(user_mode, callback) {
		if (!this.hasCurrentServerConnection()) {
			return void callback(new Error('No current server connection'));
		}

		var connection = this.getCurrentServerConnection();

		connection.addUserMode(user_mode, callback);
	}

	removeUserMode(user_mode, callback) {
		if (!this.hasCurrentServerConnection()) {
			return void callback(new Error('No current server connection'));
		}

		var connection = this.getCurrentServerConnection();

		connection.removeUserMode(user_mode, callback);
	}

	isRestricted() {
		if (!this.hasCurrentServerConnection()) {
			return false;
		}

		var connection = this.getCurrentServerConnection();

		return connection.isRestricted();
	}

	getMotd(callback) {
		if (!this.hasCurrentServerConnection()) {
			return void callback(new Error('No current server connection'));
		}

		return this.getCurrentServerConnection().getMotd(callback);
	}

	quit(message, callback) {
		if (!this.hasCurrentServerConnection()) {
			return void callback(new Error('No current server connection'));
		}

		this.getCurrentServerConnection().quit(message, callback);
	}

	/**
	 * @param   {string|null} away_message
	 * @param   {function} callback
	 * @returns {void}
	 */
	setAwayMessage(away_message, callback) {
		if (!this.hasCurrentServerConnection()) {
			return void callback(new Error('No current server connection'));
		}

		var connection = this.getCurrentServerConnection();

		return void connection.setAwayMessage(away_message, callback);
	}

	/**
	 * @param   {function} callback
	 * @returns {void}
	 */
	removeAwayMessage(callback) {
		return this.setAwayMessage(null, callback);
	}

	/**
	 * @returns {boolean}
	 */
	isAway() {
		if (!this.hasCurrentServerConnection()) {
			return false;
		}

		return this.getCurrentServerConnection().isAway();
	}

	/**
	 * @returns {string|null}
	 */
	getAwayMessage() {
		if (!this.hasCurrentServerConnection()) {
			return null;
		}

		return this.getCurrentServerConnection().getAwayMessage();
	}

}

extend(Client.prototype, {
	server_connections:        null,
	current_server_connection: null,
	nickname:                  null,
	username:                  null,
	realname:                  null,
	password:                  null,
	log_inbound_messages:      false,
	log_outbound_messages:     false,
	autoregister:              true
});

module.exports = Client;
