var
	req = require('req');

var
	Net          = require('net'),
	EventEmitter = require('events').EventEmitter;

var
	defer      = req('/utilities/defer'),
	extend     = req('/utilities/extend'),
	has        = req('/utilities/has'),
	add        = req('/utilities/add'),
	remove     = req('/utilities/remove'),
	isFunction = req('/utilities/is-function'),
	isBoolean  = req('/utilities/is-boolean');

var
	Channel                = req('/lib/client/channel'),
	ReplyNumerics          = req('/constants/reply-numerics'),
	Commands               = req('/constants/commands'),
	ServerConnectionEvents = req('/lib/client/server-connection/constants/events'),
	ClientRegistry         = req('/lib/client-registry'),
	MessageParser          = req('/lib/client/message-parser'),
	ClientMessage          = req('/lib/client/message'),
	ErrorReasons           = req('/constants/error-reasons'),
	ClientDetails          = req('/lib/client-details'),
	ServerDetails          = req('/lib/server-details');


var
	AlreadyConnectedError     = req('/lib/errors/already-connected'),
	InvalidCallbackError      = req('/lib/errors/invalid-callback'),
	AlreadyInChannelError     = req('/lib/errors/already-in-channel'),
	NotInChannelError         = req('/lib/errors/not-in-channel'),
	InvalidClientMessageError = req('/lib/errors/invalid-client-message'),
	NotConnectedError         = req('/lib/errors/not-connected'),
	InvalidServerSSLError     = req('/lib/errors/invalid-server-ssl'),
	NotYetImplementedError    = req('/lib/errors/not-yet-implemented');


var
	ClientJoinMessage     = req('/lib/client/messages/join'),
	ClientPartMessage     = req('/lib/client/messages/part'),
	ClientPrivateMessage  = req('/lib/client/messages/private'),
	ClientPasswordMessage = req('/lib/client/messages/password'),
	ClientNickMessage     = req('/lib/client/messages/nick'),
	ClientUserMessage     = req('/lib/client/messages/user'),
	ClientTopicMessage    = req('/lib/client/messages/topic'),
	ClientPongMessage     = req('/lib/client/messages/pong');


const
	DEFAULT_PORT     = 6667,
	DEFAULT_SSL      = false,
	DEFAULT_USERNAME = 'pirc',
	DEFAULT_REALNAME = 'pirc',
	DEFAULT_NICK     = 'pirc';


class ServerConnection extends EventEmitter {

	constructor(parameters) {
		super();

		this.queries  = [ ];

		var server_details = this.getServerDetails();

		server_details.setHostname(parameters.hostname);

		if (parameters.port !== undefined) {
			server_details.setPort(parameters.port);
		} else {
			server_details.setPort(DEFAULT_PORT);
		}

		var client_details = this.getClientDetails();

		if (parameters.username !== undefined) {
			client_details.setUsername(parameters.username);
		} else {
			client_details.setUsername(DEFAULT_USERNAME);
		}

		if (parameters.realname !== undefined) {
			client_details.setRealname(parameters.realname);
		} else {
			client_details.setRealname(DEFAULT_REALNAME);
		}

		if (parameters.nick !== undefined) {
			client_details.setNick(parameters.nick);
		} else {
			client_details.setNick(DEFAULT_NICK);
		}

		if (parameters.password !== undefined) {
			this.setPassword(parameters.password);
		}

		this.init();
	}

	init() {
		this.channels         = [ ];
		this.channels_by_name = { };

		this.client_registry = new ClientRegistry();

		this.bindSocketHandlers();
		this.bindChannelHandlers();
	}

	getServerDetails() {
		if (!this.server_details) {
			this.server_details = new ServerDetails();
		}

		return this.server_details;
	}

	getClientDetails() {
		if (!this.client_details) {
			this.client_details = new ClientDetails();
		}

		return this.client_details;
	}

	getNick() {
		return this.getClientDetails().getNick();
	}

	setSSL(ssl) {
		this.validateSSL(ssl);

		this.ssl = ssl;

		throw new NotYetImplementedError('ssl support');
	}

	getSSL() {
		this.validateSSL(this.ssl);
		return this.ssl;
	}

	validateSSL(ssl) {
		if (!isBoolean(ssl)) {
			throw new InvalidServerSSLError(ssl, ErrorReasons.WRONG_TYPE);
		}
	}

	handleMessage(message) {
		if (message.hasReplyNumeric()) {
			return this.handleReplyMessage(message);
		} else if (message.hasCommand()) {
			return this.handleCommandMessage(message);
		} else {
			throw new Error(`
				Invalid message received; neither a reply nor command
			`);
		}
	}

	handleReplyMessage(message) {
		var numeric = message.getReplyNumeric();

		switch (numeric) {
			case ReplyNumerics.RPL_TOPIC:
				return this.handleChannelTopicMessage(message);

			case ReplyNumerics.RPL_TOPICWHOTIME:
				return this.handleChannelTopicDetailsMessage(message);

			case ReplyNumerics.RPL_NAMREPLY:
				return this.handleChannelNamesReplyMessage(message);

			case ReplyNumerics.RPL_ENDOFNAMES:
				return this.handleChannelEndOfNamesMessage(message);

			default:
				// Noop.
				return;
		}
	}

	handleCommandMessage(message) {
		var command = message.getCommand();

		switch (command) {
			case Commands.JOIN:
				return this.handleJoinMessage(message);

			case Commands.PART:
				return this.handlePartMessage(message);

			case Commands.PRIVMSG:
				if (message.hasChannelTarget()) {
					return this.handleChannelPrivateMessage(message);
				} else {
					throw new Error(`
						Implement PM parsing
					`);
				}

			case Commands.PING:
				return this.handlePingMessage(message);

			default:
				// Noop.
				return;
		}
	}

	handleJoinMessage(message) {
		var
			channel_name = message.getChannelDetails().getName(),
			channel      = this.getChannelByName(channel_name);

		channel.handleJoinMessage(message);

		if (message.getNick() === this.getNick()) {
			channel.dispatchJoinCallbacks();
		}
	}

	handlePartMessage(message) {
		var
			channel_name = message.getChannelDetails().getName(),
			channel      = this.getChannelByName(channel_name);

		channel.handlePartMessage(message);

		if (message.getNick() !== this.getNick()) {
			return;
		}

		remove(channel).from(this.channels);
		delete this.channels_by_name[channel_name];

		channel.off('message', this.handleChannelMessage);
		channel.dispatchPartCallbacks();
		channel.destroy();
	}

	handleChannelPrivateMessage(message) {
		var channel_targets = message.getChannelTargets();

		channel_targets.forEach(function each(target) {
			var
				channel_name = target.getName(),
				channel      = this.getChannelByName(channel_name);

			if (!channel) {
				throw new Error('implement');
			}

			channel.handlePrivateMessage(message);
		}, this);
	}

	handleChannelTopicMessage(message) {
		var channel_name = message.getChannelDetails().getName();

		this.getChannelByName(channel_name).handleTopicMessage(message);
	}

	handleChannelTopicDetailsMessage(message) {
		var channel_name = message.getChannelDetails().getName();

		this.getChannelByName(channel_name).handleTopicDetailsMessage(message);
	}

	handleChannelNamesReplyMessage(message) {
		var channel_name = message.getChannelDetails().getName();

		this.getChannelByName(channel_name).handleNamesReplyMessage(message);
	}

	handleChannelEndOfNamesMessage(message) {
		var channel_name = message.getChannelDetails().getName();

		this.getChannelByName(channel_name).handleEndOfNamesMessage(message);
	}

	handlePingMessage(ping_message) {
		var
			pong_message = new ClientPongMessage(),
			hostname     = ping_message.getServerDetails().getHostname();

		pong_message.getServerDetails().setHostname(hostname);

		this.sendMessage(pong_message);
	}

	getChannelByName(channel_name) {
		return this.channels_by_name[channel_name];
	}

	isWithinChannelName(channel_name) {
		var channel = this.getChannelByName(channel_name);

		if (!channel) {
			return false;
		}

		return has(this.channels, channel);
	}

	joinChannelByName(channel_name, callback) {
		if (this.isWithinChannelName(channel_name)) {
			return void callback(new AlreadyInChannelError(channel_name));
		}

		var channel = new Channel(channel_name);

		channel.setClientRegistry(this.getClientRegistry());

		channel.addJoinCallback(callback);
		add(channel).to(this.channels);

		channel.on('message', this.handleChannelMessage);

		this.channels_by_name[channel_name] = channel;

		var message = new ClientJoinMessage();

		message.addChannelName(channel_name);
		this.sendMessage(message);
	}

	leaveChannelByName(channel_name, callback) {
		if (!this.isWithinChannelName(channel_name)) {
			return void callback(new NotInChannelError(channel_name));
		}

		var channel = this.getChannelByName(channel_name);

		channel.addPartCallback(callback);

		var message = new ClientPartMessage();

		message.addChannelName(channel_name);
		this.sendMessage(message);
	}

	sendTextToChannel(text, channel) {
		return this.sendTextToChannelByName(text, channel.getName());
	}

	sendTextToChannelByName(text, channel_name) {
		// Note that we don't enforce actually being present in the target
		// channels in order to send messages to them. This is not required.
		// It's the responsibility of the server to determine whether or not
		// the message we send upstream from this point should actually be
		// passed to the channels in question (if they even exist).
		ClientPrivateMessage.getMultipleChannelMessages({
			body:         text,
			channel_name: channel_name
		}).forEach(this.sendMessage, this);
	}

	sendTextToClient(text, client_details) {
		return this.sendTextToClientByNick(text, client_details.getNick());
	}

	sendTextToClientByNick(text, nick) {
		ClientPrivateMessage.getMultipleClientMessages({
			body: text,
			nick: nick
		}).forEach(this.sendMessage, this);
	}

	setTopicForChannelByName(topic, channel_name) {
		var message = new ClientTopicMessage();

		message.addChannelName(channel_name);
		message.setTopic(topic);

		this.sendMessage(message);
	}

	getClientRegistry() {
		return this.client_registry;
	}

	isRegistered() {
		return this.registered === true;
	}

	isConnected() {
		return this.connected === true;
	}

	connect(callback) {
		if (!isFunction(callback)) {
			throw new InvalidCallbackError();
		}

		if (this.isConnected()) {
			return void defer(callback, new AlreadyConnectedError());
		}

		var server_details = this.getServerDetails();

		this.socket = Net.createConnection({
			host: server_details.getHostname(),
			port: server_details.getPort()
		});

		this.bindSocketEvents();

		function handleSuccess() {
			this.removeListener(
				ServerConnectionEvents.CONNECTION_FAILURE,
				handleFailure
			);

			return void callback(null);
		}

		function handleFailure(error) {
			this.removeListener(
				ServerConnectionEvents.CONNECTION_SUCCESS,
				handleSuccess
			);

			return void callback(error);
		}

		this.once(ServerConnectionEvents.CONNECTION_SUCCESS, handleSuccess);
		this.once(ServerConnectionEvents.CONNECTION_FAILURE, handleFailure);
	}

	destroy() {
		this.callMethodAcrossInterfaces('destroy');
	}

	bindSocketHandlers() {
		this.handleSocketData    = this.handleSocketData.bind(this);
		this.handleSocketConnect = this.handleSocketConnect.bind(this);
		this.handleSocketError   = this.handleSocketError.bind(this);
		this.handleSocketEnd     = this.handleSocketEnd.bind(this);
		this.handleSocketClose   = this.handleSocketClose.bind(this);
	}

	bindChannelHandlers() {
		this.handleChannelMessage = this.handleChannelMessage.bind(this);
	}

	handleSocketData(data) {
		var messages = data.toString('utf8').split('\r\n');

		messages.forEach(this.handleIncomingMessage, this);
	}

	handleIncomingMessage(message) {
		var parsed_message = MessageParser.parse(message);

		if (parsed_message !== null) {
			console.log('<< ' + message.replace('\n', ''));
			this.handleMessage(parsed_message);
		}
	}

	handleSocketConnect() {
		this.connected = true;

		this.emit(ServerConnectionEvents.CONNECTION_SUCCESS);
	}

	handleSocketError(error) {
		if (!this.connected) {
			this.emit(ServerConnectionEvents.CONNECTION_FAILURE);
		}
	}

	handleSocketEnd() {
		this.unbindSocketEvents();

		this.emit(ServerConnectionEvents.CONNECTION_END);
	}

	handleSocketClose() {
		throw new Error('implement');
	}

	bindSocketEvents() {
		this.socket.on('data',    this.handleSocketData);
		this.socket.on('connect', this.handleSocketConnect);
		this.socket.on('error',   this.handleSocketError);
		this.socket.on('end',     this.handleSocketEnd);
		this.socket.on('close',   this.handleSocketClose);
	}

	unbindSocketEvents() {
		this.socket.removeListener('data',    this.handleSocketData);
		this.socket.removeListener('connect', this.handleSocketConnect);
		this.socket.removeListener('error',   this.handleSocketError);
		this.socket.removeListener('end',     this.handleSocketEnd);
		this.socket.removeListener('close',   this.handleSocketClose);
	}

	write(message) {
		var parts = message.split('\r\n').filter(function filter(part) {
			return part.length > 0;
		});

		console.log('>> ' + parts.join(''));

		this.socket.write(message);
	}

	sendMessage(message) {
		if (!(message instanceof ClientMessage)) {
			throw new InvalidClientMessageError(message, ErrorReasons.UNKNOWN_TYPE);
		}

		if (!this.isConnected()) {
			throw new NotConnectedError();
		}

		this.write(message.serialize());
	}

	sendRegistrationMessages() {
		// If a password is specified, it should be sent before the
		// nick or user messages.
		if (this.password) {
			let password_message = new ClientPasswordMessage();

			password_message.setPassword(this.password);

			this.sendMessage(password_message);
		}

		var
			nick_message   = new ClientNickMessage(),
			user_message   = new ClientUserMessage(),
			client_details = this.getClientDetails();

		nick_message.setDesiredNick(client_details.getNick());

		this.sendMessage(nick_message);


		user_message.setUsername(client_details.getUsername())
		            .setRealname(client_details.getRealname())
					.setModes(client_details.getModes());

		this.sendMessage(user_message);
	}

	handleChannelMessage(message) {
		this.emit(ServerConnectionEvents.INCOMING_MESSAGE, message);
	}

}

extend(ServerConnection.prototype, {
	ssl:              DEFAULT_SSL,
	password:         null,

	queries:          null,

	registered:       false,
	connected:        false,
	socket:           null,

	channels:         null,
	channels_by_name: null,

	client_registry:  null,
	client_details:   null,
	server_details:   null
});


module.exports = ServerConnection;

