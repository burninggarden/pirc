var
	req = require('req'),
	Net = require('net');

var
	defer        = req('/utilities/defer'),
	deferOrThrow = req('/utilities/defer-or-throw'),
	extend       = req('/utilities/extend'),
	has          = req('/utilities/has'),
	add          = req('/utilities/add'),
	remove       = req('/utilities/remove'),
	isFunction   = req('/utilities/is-function'),
	isBoolean    = req('/utilities/is-boolean');

var
	Connection             = req('/lib/connection'),
	Channel                = req('/lib/client/channel'),
	Delimiters             = req('/constants/delimiters'),
	ReplyNumerics          = req('/constants/reply-numerics'),
	Commands               = req('/constants/commands'),
	ServerConnectionEvents = req('/lib/client/server-connection/constants/events'),
	UserDetailsRegistry    = req('/lib/client/registries/user-details'),
	MessageParser          = req('/lib/client/message-parser'),
	ClientMessage          = req('/lib/client/message'),
	ErrorReasons           = req('/constants/error-reasons'),
	UserDetails            = req('/lib/user-details'),
	ServerDetails          = req('/lib/server-details'),
	MessageEvent           = req('/lib/client/events/message'),
	ChannelDetails         = req('/lib/channel-details');


var
	AlreadyConnectedError     = req('/lib/errors/already-connected'),
	InvalidCallbackError      = req('/lib/errors/invalid-callback'),
	AlreadyInChannelError     = req('/lib/errors/already-in-channel'),
	NotInChannelError         = req('/lib/errors/not-in-channel'),
	InvalidClientMessageError = req('/lib/errors/invalid-client-message'),
	NotConnectedError         = req('/lib/errors/not-connected'),
	InvalidServerSSLError     = req('/lib/errors/invalid-server-ssl'),
	NotYetImplementedError    = req('/lib/errors/not-yet-implemented'),
	UnableToJoinChannelError  = req('/lib/errors/unable-to-join-channel');


var
	ClientJoinMessage     = req('/lib/client/messages/join'),
	ClientPartMessage     = req('/lib/client/messages/part'),
	ClientPrivateMessage  = req('/lib/client/messages/private'),
	ClientPasswordMessage = req('/lib/client/messages/password'),
	ClientNickMessage     = req('/lib/client/messages/nick'),
	ClientUserMessage     = req('/lib/client/messages/user'),
	ClientTopicMessage    = req('/lib/client/messages/topic'),
	ClientPongMessage     = req('/lib/client/messages/pong'),
	ClientWhoisMessage    = req('/lib/client/messages/whois');


const
	DEFAULT_PORT     = 6667,
	DEFAULT_SSL      = false,
	DEFAULT_USERNAME = 'pirc',
	DEFAULT_REALNAME = 'pirc',
	DEFAULT_NICK     = 'pirc';


class ServerConnection extends Connection {

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

		var user_details = this.getUserDetails();

		if (parameters.username !== undefined) {
			user_details.setUsername(parameters.username);
		} else {
			user_details.setUsername(DEFAULT_USERNAME);
		}

		if (parameters.realname !== undefined) {
			user_details.setRealname(parameters.realname);
		} else {
			user_details.setRealname(DEFAULT_REALNAME);
		}

		if (parameters.nick !== undefined) {
			user_details.setNick(parameters.nick);
		} else {
			user_details.setNick(DEFAULT_NICK);
		}

		if (parameters.password !== undefined) {
			this.setPassword(parameters.password);
		}

		this.init();
	}

	init() {
		this.channels         = [ ];
		this.channels_by_name = { };

		this.user_details_registry = new UserDetailsRegistry();

		this.bindSocketHandlers();
		this.bindChannelHandlers();
	}

	getServerDetails() {
		if (!this.server_details) {
			this.server_details = new ServerDetails();
		}

		return this.server_details;
	}

	getUserDetails() {
		if (!this.user_details) {
			this.user_details = new UserDetails();
		}

		return this.user_details;
	}

	getNick() {
		return this.getUserDetails().getNick();
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
			case ReplyNumerics.RPL_WELCOME:
			case ReplyNumerics.RPL_YOURHOST:
			case ReplyNumerics.RPL_CREATED:
				// Noop.
				return;

			case ReplyNumerics.RPL_MYINFO:
				return this.handleServerInfoMessage(message);

			case ReplyNumerics.RPL_ISUPPORT:
				// TODO: Implement this, noop for now.
				return;

			case ReplyNumerics.RPL_LUSERCLIENT:
				// TODO: Implement this, noop for now.
				return;

			case ReplyNumerics.RPL_LUSEROP:
				return this.handleLUserOpMessage(message);

			case ReplyNumerics.RPL_LUSERUNKNOWN:
				return this.handleLUserUnknownMessage(message);

			case ReplyNumerics.RPL_LUSERCHANNELS:
				return this.handleLUserChannelsMessage(message);

			case ReplyNumerics.RPL_LUSERME:
				// Noop.
				return;

			case ReplyNumerics.RPL_STATSCONN:
				// Noop.
				return;

			case ReplyNumerics.RPL_LOCALUSERS:
				return this.handleLocalUsersMessage(message);

			case ReplyNumerics.RPL_GLOBALUSERS:
				return this.handleGlobalUsersMessage(message);

			case ReplyNumerics.RPL_TOPIC:
				return this.handleChannelTopicMessage(message);

			case ReplyNumerics.RPL_TOPICWHOTIME:
				return this.handleChannelTopicDetailsMessage(message);

			case ReplyNumerics.RPL_NAMREPLY:
				return this.handleChannelNamesReplyMessage(message);

			case ReplyNumerics.RPL_ENDOFNAMES:
				return this.handleChannelEndOfNamesMessage(message);

			case ReplyNumerics.RPL_CHANNEL_URL:
				return this.handleChannelUrlMessage(message);

			case ReplyNumerics.RPL_WHOISUSER:
				return this.handleWhoisUserMessage(message);

			case ReplyNumerics.RPL_WHOISSERVER:
				return this.handleWhoisServerMessage(message);

			case ReplyNumerics.RPL_WHOISCHANNELS:
				return this.handleWhoisChannelsMessage(message);

			case ReplyNumerics.RPL_ENDOFWHOIS:
				return this.handleEndOfWhoisMessage(message);

			case ReplyNumerics.RPL_MOTD:
				return this.handleMotdMessage(message);

			case ReplyNumerics.RPL_MOTDSTART:
				return this.handleMotdStartMessage(message);

			case ReplyNumerics.RPL_ENDOFMOTD:
				return this.handleEndOfMotdMessage(message);




			case ReplyNumerics.ERR_NOMOTD:
				return this.handleNoMotdMessage(message);

			case ReplyNumerics.ERR_LINKCHANNEL:
				return this.handleLinkChannelMessage(message);

			default:
				throw new NotYetImplementedError(
					`Message handling for reply numeric ${numeric}`
				);
		}
	}

	handleCommandMessage(message) {
		var command = message.getCommand();

		switch (command) {
			case Commands.JOIN:
				return this.handleJoinMessage(message);

			case Commands.MODE:
				return this.handleModeMessage(message);

			case Commands.PART:
				return this.handlePartMessage(message);

			case Commands.PRIVMSG:
				if (message.hasChannelTarget()) {
					return this.handleChannelPrivateMessage(message);
				} else if (message.hasUserTarget()) {
					return this.handleUserPrivateMessage(message);
				} else {
					throw new Error('wtf is this');
				}

			case Commands.PING:
				return this.handlePingMessage(message);

			case Commands.QUIT:
				return this.handleQuitMessage(message);

			case Commands.TOPIC:
				return this.handleTopicMessage(message);

			default:
				// Noop.
				return;
		}
	}

	handleJoinMessage(message) {
		var channel = this.getOrCreateChannelForMessage(message);

		channel.handleJoinMessage(message);

		if (message.getNick() === this.getNick()) {
			channel.dispatchJoinCallbacks();
		}
	}

	handleModeMessage(message) {
		if (message.hasChannelTarget()) {
			return this.handleChannelModeMessage(message);
		} else if (message.hasUserTarget()) {
			return this.handleUserModeMessage(message);
		} else {
			throw new Error('Invalid mode message: ' + message.raw_message);
		}
	}

	handleChannelModeMessage(message) {
		this.getChannelForMessage(message).handleModeMessage(message);
	}

	handleUserModeMessage(message) {
		this.getUserDetailsForMessage(message).handleModeMessage(message);
	}

	handlePartMessage(message) {
		var channel = this.getChannelForMessage(message);

		channel.handlePartMessage(message);

		if (message.getNick() === this.getNick()) {
			this.destroyChannel(channel);
		}
	}

	handleQuitMessage(message) {
		this.channels.forEach(function each(channel) {
			channel.handleQuitMessage(message);
		});
	}

	handleChannelPrivateMessage(message) {
		var channel_targets = message.getChannelTargets();

		channel_targets.forEach(function each(target) {
			this.getChannelForChannelDetails(target).handlePrivateMessage(message);
		}, this);
	}

	handleUserPrivateMessage(message) {
		var user = this.getUserDetailsForMessage(message);

		var message_event = new MessageEvent();

		message_event.setUser(user);
		message_event.setMessage(message);

		this.emit(ServerConnectionEvents.INCOMING_MESSAGE, message_event);
	}

	handleServerInfoMessage(message) {
		var server_details = this.getServerDetails();

		server_details.setName(message.getName());
		server_details.setVersion(message.getVersion());
		server_details.setUserModes(message.getUserModes());
		server_details.setChannelModes(message.getChannelModes());
	}

	handleLUserOpMessage(message) {
		this.getServerDetails().handleLUserOpMessage(message);
	}

	handleLUserUnknownMessage(message) {
		this.getServerDetails().handleLUserUnknownMessage(message);
	}

	handleLUserChannelsMessage(message) {
		this.getServerDetails().handleLUserChannelsMessage(message);
	}

	handleLocalUsersMessage(message) {
		this.getServerDetails().handleLocalUsersMessage(message);
	}

	handleGlobalUsersMessage(message) {
		this.getServerDetails().handleGlobalUsersMessage(message);
	}

	handleChannelTopicMessage(message) {
		this.getChannelForMessage(message).handleTopicMessage(message);
	}

	handleChannelTopicDetailsMessage(message) {
		this.getChannelForMessage(message).handleTopicDetailsMessage(message);
	}

	handleChannelNamesReplyMessage(message) {
		this.getChannelForMessage(message).handleNamesReplyMessage(message);
	}

	handleChannelEndOfNamesMessage(message) {
		this.getChannelForMessage(message).handleEndOfNamesMessage(message);
	}

	handleChannelUrlMessage(message) {
		this.getChannelForMessage(message).handleUrlMessage(message);
	}

	handleWhoisUserMessage(message) {
		var user_details = this.getTargetUserDetailsForMessage(message);

		user_details.handleWhoisUserMessage(message);
	}

	handleWhoisServerMessage(message) {
		var user_details = this.getTargetUserDetailsForMessage(message);

		user_details.handleWhoisServerMessage(message);
	}

	handleWhoisChannelsMessage(message) {
		var user_details = this.getTargetUserDetailsForMessage(message);

		user_details.handleWhoisChannelsMessage(message);
	}

	handleEndOfWhoisMessage(message) {
		var user_details = this.getTargetUserDetailsForMessage(message);

		user_details.handleEndOfWhoisMessage(message);
	}

	handleLinkChannelMessage(message) {
		var
			channel_name    = message.getDesiredChannelName(),
			desired_channel = this.getChannelForChannelName(channel_name);

		var error = new UnableToJoinChannelError(
			channel_name,
			ErrorReasons.FORWARDED_ELSEWHERE
		);

		desired_channel.dispatchJoinCallbacks(error);
	}

	handlePingMessage(ping_message) {
		var
			pong_message = new ClientPongMessage(),
			hostname     = ping_message.getServerDetails().getHostname();

		pong_message.getServerDetails().setHostname(hostname);

		this.sendMessage(pong_message);
	}

	handleTopicMessage(message) {
		this.getChannelForMessage(message).handleTopicMessage(message);
	}

	handleMotdMessage(message) {
		this.getServerDetails().handleMotdMessage(message);
	}

	handleMotdStartMessage(message) {
		this.getServerDetails().handleMotdStartMessage(message);
	}

	handleEndOfMotdMessage(message) {
		this.getServerDetails().handleEndOfMotdMessage(message);
	}

	handleNoMotdMessage(message) {
		this.getServerDetails().handleNoMotdMessage(message);
	}

	getUserDetailsForMessage(message) {
		return this.getUserDetailsRegistry().getUserDetailsForMessage(message);
	}

	getTargetUserDetailsForMessage(message) {
		var
			target_user_details = message.getTargetUserDetails(),
			registry            = this.getUserDetailsRegistry();

		return registry.getOrStoreUserDetails(target_user_details);
	}

	destroyChannel(channel) {
		this.destroyChannelName(channel.getName());
	}

	destroyChannelName(channel_name) {
		var channel = this.getChannelForChannelName(channel_name);

		remove(channel).from(this.channels);

		var standardized_name = channel.getStandardizedName();

		delete this.channels_by_name[standardized_name];

		channel.removeListener('message', this.handleChannelMessage);
		channel.dispatchPartCallbacks();
		channel.destroy();
	}

	getOrCreateChannelForMessage(message) {
		return (
			   this.getChannelForMessage(message)
			|| this.createChannelForMessage(message)
		);
	}

	createChannelForMessage(message) {
		return this.createChannelForChannelDetails(message.getChannelDetails());
	}

	createChannelForChannelDetails(channel_details) {
		return this.createChannelForChannelName(channel_details.getName());
	}

	createChannelForChannelName(channel_name) {
		var channel = new Channel(channel_name);

		channel.setUserDetailsRegistry(this.getUserDetailsRegistry());
		channel.on('message', this.handleChannelMessage);

		add(channel).to(this.channels);

		var standardized_name = channel.getStandardizedName();

		this.channels_by_name[standardized_name] = channel;

		return channel;
	}

	getChannelForMessage(message) {
		return this.getChannelForChannelDetails(message.getChannelDetails());
	}

	getChannelForChannelDetails(channel_details) {
		return this.getChannelForChannelName(channel_details.getName());
	}

	getChannelForChannelName(channel_name) {
		channel_name = ChannelDetails.standardizeName(channel_name);

		return this.channels_by_name[channel_name];
	}

	isWithinChannelName(channel_name) {
		var channel = this.getChannelForChannelName(channel_name);

		if (!channel) {
			return false;
		}

		return has(this.channels, channel);
	}

	joinChannelName(channel_name, callback) {
		if (this.isWithinChannelName(channel_name)) {
			let error = new AlreadyInChannelError(channel_name);

			return deferOrThrow(callback, error);
		}

		var channel = this.createChannelForChannelName(channel_name);

		if (callback) {
			channel.addJoinCallback(callback);
		}

		var message = new ClientJoinMessage();

		message.addChannelName(channel_name);
		this.sendMessage(message);
	}

	leaveChannelName(channel_name, callback) {
		if (!this.isWithinChannelName(channel_name)) {
			return void callback(new NotInChannelError(channel_name));
		}

		var channel = this.getChannelForChannelName(channel_name);

		if (callback) {
			channel.addPartCallback(callback);
		}

		var message = new ClientPartMessage();

		message.addChannelName(channel_name);
		this.sendMessage(message);
	}

	sendTextToChannel(text, channel) {
		return this.sendTextToChannelName(text, channel.getName());
	}

	sendTextToChannelName(text, channel_name) {
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

	sendTextToClient(text, user_details) {
		return this.sendTextToClientByNick(text, user_details.getNick());
	}

	sendTextToClientByNick(text, nick) {
		ClientPrivateMessage.getMultipleClientMessages({
			body: text,
			nick: nick
		}).forEach(this.sendMessage, this);
	}

	setTopicForChannelName(topic, channel_name) {
		var message = new ClientTopicMessage();

		message.addChannelName(channel_name);
		message.setTopic(topic);

		this.sendMessage(message);
	}

	sendWhoisQueryForNick(nick, callback) {
		var
			registry     = this.getUserDetailsRegistry(),
			user_details = registry.getOrStoreUserDetailsForNick(nick);

		if (callback) {
			user_details.addWhoisCallback(callback);
		}

		var message = new ClientWhoisMessage();

		message.addTarget(user_details);

		this.sendMessage(message);
	}

	getUserDetailsRegistry() {
		return this.user_details_registry;
	}

	getUserDetailsForMessage(message) {
		return this.getUserDetailsRegistry().getUserDetailsForMessage(
			message
		);
	}

	isRegistered() {
		return this.registered === true;
	}

	isConnected() {
		return this.connected === true;
	}

	connect(callback) {
		if (!isFunction(callback)) {
			let reason;

			if (!callback) {
				reason = ErrorReasons.OMITTED;
			} else {
				reason = ErrorReasons.WRONG_TYPE;
			}

			throw new InvalidCallbackError(callback, reason);
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

			return void callback(null, this);
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

	hasMessageRemainder() {
		return this.getMessageRemainder() !== null;
	}

	getMessageRemainder() {
		return this.message_remainder;
	}

	setMessageRemainder(message_remainder) {
		this.message_remainder = message_remainder;
	}

	clearMessageRemainder() {
		this.setMessageRemainder(null);
	}

	handleSocketData(data) {
		var data_string = data.toString('utf8');

		if (this.hasMessageRemainder()) {
			data_string = this.getMessageRemainder() + data_string;
		}

		var index = data_string.indexOf(Delimiters.CRLF);

		while (index !== -1) {
			let message = data_string.slice(0, index);

			this.handleIncomingMessage(message);

			data_string = data_string.slice(index + Delimiters.CRLF.length);
			index = data_string.indexOf(Delimiters.CRLF);
		}

		if (data_string.length > 0) {
			this.setMessageRemainder(data_string);
		} else {
			this.clearMessageRemainder();
		}
	}

	handleIncomingMessage(message) {
		var parsed_message = MessageParser.parse(message);

		if (parsed_message !== null) {
			if (this.shouldLogInboundMessages()) {
				this.logInboundMessage(message.replace('\n', ''));
			}

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

		if (this.shouldLogOutboundMessages()) {
			this.logOutboundMessage(parts.join(''));
		}

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
			nick_message = new ClientNickMessage(),
			user_message = new ClientUserMessage(),
			user_details = this.getUserDetails();

		nick_message.setDesiredNick(user_details.getNick());

		this.sendMessage(nick_message);


		user_message.setUsername(user_details.getUsername())
		            .setRealname(user_details.getRealname())
					.setModes(user_details.getModes());

		this.sendMessage(user_message);
	}

	handleChannelMessage(message) {
		this.emit(ServerConnectionEvents.INCOMING_MESSAGE, message);
	}

	getMotd(callback) {
		var server_details = this.getServerDetails();

		if (server_details.hasReceivedMotd()) {
			defer(
				callback,
				server_details.getMotdError(),
				server_details.getMotd()
			);
		} else {
			server_details.addMotdCallback(callback);
		}
	}

}

extend(ServerConnection.prototype, {
	ssl:                   DEFAULT_SSL,
	password:              null,

	queries:               null,

	registered:            false,
	connected:             false,
	socket:                null,

	channels:              null,
	channels_by_name:      null,

	user_details_registry: null,
	user_details:          null,
	server_details:        null,

	message_remainder:     null

});


module.exports = ServerConnection;

