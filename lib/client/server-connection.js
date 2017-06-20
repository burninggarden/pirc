var
	Net = require('net');

var
	defer        = req('/lib/utilities/defer'),
	deferOrThrow = req('/lib/utilities/defer-or-throw'),
	extend       = req('/lib/utilities/extend'),
	has          = req('/lib/utilities/has'),
	add          = req('/lib/utilities/add'),
	remove       = req('/lib/utilities/remove'),
	random       = req('/lib/utilities/random'),
	isFunction   = req('/lib/utilities/is-function'),
	isBoolean    = req('/lib/utilities/is-boolean');


var
	Connection             = req('/lib/connection'),
	Channel                = req('/lib/client/channel'),
	Replies                = req('/lib/constants/replies'),
	Commands               = req('/lib/constants/commands'),
	ServerConnectionEvents = req('/lib/client/server-connection/constants/events'),
	UserDetailsRegistry    = req('/lib/client/registries/user-details'),
	CommandMessage         = req('/lib/messages/command'),
	ErrorReasons           = req('/lib/constants/error-reasons'),
	UserDetails            = req('/lib/user-details'),
	ServerDetails          = req('/lib/server-details'),
	MessageEvent           = req('/lib/client/events/message'),
	ChannelDetails         = req('/lib/channel-details'),
	ConnectionEvents       = req('/lib/constants/connection-events');


var
	AlreadyConnectedError      = req('/lib/errors/already-connected'),
	InvalidCallbackError       = req('/lib/errors/invalid-callback'),
	AlreadyInChannelError      = req('/lib/errors/already-in-channel'),
	NotOnChannelError          = req('/lib/errors/not-on-channel'),
	InvalidCommandMessageError = req('/lib/errors/invalid-command-message'),
	InvalidServerSSLError      = req('/lib/errors/invalid-server-ssl'),
	NotYetImplementedError     = req('/lib/errors/not-yet-implemented'),
	UnableToJoinChannelError   = req('/lib/errors/unable-to-join-channel');


var
	JoinMessage     = req('/lib/messages/commands/join'),
	PartMessage     = req('/lib/messages/commands/part'),
	PrivateMessage  = req('/lib/messages/commands/private'),
	PasswordMessage = req('/lib/messages/commands/password'),
	NickMessage     = req('/lib/messages/commands/nick'),
	UserMessage     = req('/lib/messages/commands/user'),
	TopicMessage    = req('/lib/messages/commands/topic'),
	PongMessage     = req('/lib/messages/commands/pong'),
	WhoisMessage    = req('/lib/messages/commands/whois');

var
	NoSuchChannelMessage = req('/lib/messages/replies/no-such-channel');


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

		var server_details = this.getRemoteServerDetails();

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

		if (parameters.nick !== undefined && parameters.nickname === undefined) {
			parameters.nickname = parameters.nick;
		}

		if (parameters.nickname !== undefined) {
			user_details.setNickname(parameters.nickname);
		} else {
			user_details.setNickname(DEFAULT_NICK);
		}

		if (parameters.password !== undefined) {
			this.setPassword(parameters.password);
		}

		this.channels         = [ ];
		this.channels_by_name = { };

		this.user_details_registry = new UserDetailsRegistry();

		this.bindChannelHandlers();
	}

	getRemoteServerDetails() {
		if (!this.remote_server_details) {
			this.remote_server_details = new ServerDetails();
		}

		return this.remote_server_details;
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
		if (message.hasReply()) {
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
		var numeric = message.getReply();

		switch (numeric) {
			// 001
			case Replies.RPL_WELCOME:
				return this.handleWelcomeMessage(message);

			// 002
			case Replies.RPL_YOURHOST:
				// Noop.
				return;

			// 003
			case Replies.RPL_CREATED:
				// Noop.
				return;

			// 004
			case Replies.RPL_MYINFO:
				return this.handleServerInfoMessage(message);

			// 005
			case Replies.RPL_ISUPPORT:
				// TODO: Implement this, noop for now.
				return;

			// 042
			case Replies.RPL_YOURID:
				return this.handleYourIdMessage(message);

			// 250
			case Replies.RPL_STATSDLINE:
				// Noop.
				return;

			// 251
			case Replies.RPL_LUSERCLIENT:
				// TODO: Implement this, noop for now.
				return;

			// 252
			case Replies.RPL_LUSEROP:
				return this.handleLUserOpMessage(message);

			// 253
			case Replies.RPL_LUSERUNKNOWN:
				return this.handleLUserUnknownMessage(message);

			// 254
			case Replies.RPL_LUSERCHANNELS:
				return this.handleLUserChannelsMessage(message);

			// 255
			case Replies.RPL_LUSERME:
				// Noop.
				return;

			// 265
			case Replies.RPL_LOCALUSERS:
				return this.handleLocalUsersMessage(message);

			// 266
			case Replies.RPL_GLOBALUSERS:
				return this.handleGlobalUsersMessage(message);

			// 301
			case Replies.RPL_AWAY:
				return this.handleAwayMessage(message);

			// 311
			case Replies.RPL_WHOISUSER:
				return this.handleWhoisUserMessage(message);

			// 312
			case Replies.RPL_WHOISSERVER:
				return this.handleWhoisServerMessage(message);

			// 317
			case Replies.RPL_WHOISIDLE:
				return this.handleWhoisIdleMessage(message);

			// 318
			case Replies.RPL_ENDOFWHOIS:
				return this.handleEndOfWhoisMessage(message);

			// 319
			case Replies.RPL_WHOISCHANNELS:
				return this.handleWhoisChannelsMessage(message);

			// 328
			case Replies.RPL_CHANNEL_URL:
				return this.handleChannelUrlMessage(message);

			// 330
			case Replies.RPL_WHOISACCOUNT:
				return this.handleWhoisAccountMessage(message);

			// 331
			case Replies.RPL_NOTOPIC:
				return this.handleChannelNoTopicMessage(message);

			// 332
			case Replies.RPL_TOPIC:
				return this.handleChannelTopicMessage(message);

			// 333
			case Replies.RPL_TOPICWHOTIME:
				return this.handleChannelTopicDetailsMessage(message);

			// 353
			case Replies.RPL_NAMREPLY:
				return this.handleChannelNamesReplyMessage(message);

			// 366
			case Replies.RPL_ENDOFNAMES:
				return this.handleChannelEndOfNamesMessage(message);

			// 372
			case Replies.RPL_MOTD:
				return this.handleMotdMessage(message);

			// 375
			case Replies.RPL_MOTDSTART:
				return this.handleMotdStartMessage(message);

			// 376
			case Replies.RPL_ENDOFMOTD:
				return this.handleEndOfMotdMessage(message);

			// 378
			case Replies.RPL_WHOISHOST:
				return this.handleWhoisHostMessage(message);

			// 379
			case Replies.RPL_WHOISMODES:
				return this.handleWhoisModeMessage(message);

			// 401
			case Replies.ERR_NOSUCHNICK:
				return this.handleNoSuchNickMessage(message);

			// 403
			case Replies.ERR_NOSUCHCHANNEL:
				return this.handleNoSuchChannelMessage(message);

			// 422
			case Replies.ERR_NOMOTD:
				return this.handleNoMotdMessage(message);

			// 432
			case Replies.ERR_ERRONEUSNICKNAME:
				return this.handleErroneousNicknameMessage(message);

			// 433
			case Replies.ERR_NICKNAMEINUSE:
				return this.handleNicknameInUseMessage(message);

			// 442
			case Replies.ERR_NOTONCHANNEL:
				return this.handleNotOnChannelMessage(message);

			// 451
			case Replies.ERR_NOTREGISTERED:
				return this.handleNotRegisteredMessage(message);

			// 461
			case Replies.ERR_NEEDMOREPARAMS:
				return this.handleNeedMoreParametersMessage(message);

			// 470
			case Replies.ERR_LINKCHANNEL:
				return this.handleLinkChannelMessage(message);

			// 471
			case Replies.ERR_CHANNELISFULL:
				return this.handleChannelIsFullMessage(message);

			// 472
			case Replies.ERR_UNKNOWNMODE:
				return this.handleUnknownModeMessage(message);

			// 477
			case Replies.ERR_NEEDREGGEDNICK:
				return this.handleNeedReggedNickMessage(message);

			// 481
			case Replies.ERR_NOPRIVILEGES:
				return this.handleNoPrivilegesMessage(message);

			// 501
			case Replies.ERR_UMODEUNKNOWNFLAG:
				// return this.handleUModeUnknownFlagMessage(message);
				// Noop for now:
				return;

			// 671
			case Replies.RPL_WHOISSECURE:
				return this.handleWhoisSecureMessage(message);

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

			case Commands.NICK:
				return this.handleNickMessage(message);

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
		try {
			message.validate();
		} catch (error) {
			this.emit(ServerConnectionEvents.CONNECTION_ERROR, error);
		}

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

	handleNickMessage(message) {
		this.getUserDetailsForMessage(message).handleNickMessage(message);
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
		var
			user          = this.getUserDetailsForMessage(message),
			message_event = new MessageEvent();

		message_event.setUser(user);
		message_event.setMessage(message);

		this.emit(ServerConnectionEvents.INCOMING_MESSAGE, message_event);
	}

	handleWelcomeMessage(message) {
		this.emit(ServerConnectionEvents.REGISTERED);
	}

	handleServerInfoMessage(message) {
		var server_details = this.getRemoteServerDetails();

		server_details.setHostname(message.getRemoteHostname());
		server_details.setVersion(message.getRemoteVersion());
		server_details.setUserModesFromString(message.getRemoteUserModesAsString());
		server_details.setChannelModesFromString(message.getRemoteChannelModesAsString());
	}

	handleYourIdMessage(message) {
		this.getUserDetails().handleYourIdMessage(message);
	}

	handleLUserOpMessage(message) {
		this.getRemoteServerDetails().handleLUserOpMessage(message);
	}

	handleLUserUnknownMessage(message) {
		this.getRemoteServerDetails().handleLUserUnknownMessage(message);
	}

	handleLUserChannelsMessage(message) {
		this.getRemoteServerDetails().handleLUserChannelsMessage(message);
	}

	handleLocalUsersMessage(message) {
		this.getRemoteServerDetails().handleLocalUsersMessage(message);
	}

	handleGlobalUsersMessage(message) {
		this.getRemoteServerDetails().handleGlobalUsersMessage(message);
	}

	handleAwayMessage(message) {
		var user_details = this.getTargetUserDetailsForMessage(message);

		user_details.handleAwayMessage(message);
	}

	handleChannelNoTopicMessage(message) {
		this.getChannelForMessage(message).handleNoTopicMessage(message);
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

	handleWhoisHostMessage(message) {
		var user_details = this.getTargetUserDetailsForMessage(message);

		user_details.handleWhoisHostMessage(message);
	}

	handleWhoisModeMessage(message) {
		var user_details = this.getTargetUserDetailsForMessage(message);

		user_details.handleWhoisModeMessage(message);
	}

	handleWhoisChannelsMessage(message) {
		var user_details = this.getTargetUserDetailsForMessage(message);

		user_details.handleWhoisChannelsMessage(message);
	}

	handleWhoisSecureMessage(message) {
		var user_details = this.getTargetUserDetailsForMessage(message);

		user_details.handleWhoisSecureMessage(message);
	}

	handleWhoisIdleMessage(message) {
		var user_details = this.getTargetUserDetailsForMessage(message);

		user_details.handleWhoisIdleMessage(message);
	}

	handleWhoisAccountMessage(message) {
		var user_details = this.getTargetUserDetailsForMessage(message);

		user_details.handleWhoisAccountMessage(message);
	}

	handleEndOfWhoisMessage(message) {
		var user_details = this.getTargetUserDetailsForMessage(message);

		user_details.handleEndOfWhoisMessage(message);
	}

	handleChannelIsFull(message) {
		var
			channel_name    = message.getChannelDetails().getName(),
			desired_channel = this.getChannelForChannelName(channel_name);

		var error = new UnableToJoinChannelError(
			channel_name,
			ErrorReasons.AT_MAXIMUM_CAPACITY
		);

		desired_channel.dispatchJoinCallbacks(error);
	}

	handleLinkChannelMessage(message) {
		var
			channel_name    = message.getDesiredChannelName(),
			desired_channel = this.getChannelForChannelName(channel_name);

		var error = new UnableToJoinChannelError(
			channel_name,
			ErrorReasons.FORWARDED_ELSEWHERE
		);

		error.setLinkedChannelName(message.getLinkedChannelName());

		desired_channel.dispatchJoinCallbacks(error);
	}

	handleUnknownModeMessage(message) {
		// TODO:
		// Wire this up to the relevant mode callbacks
		this.emit(ServerConnectionEvents.CONNECTION_ERROR, message.toError());
	}

	handleNeedReggedNickMessage(message) {
		var
			channel_name    = message.getChannelDetails().getName(),
			desired_channel = this.getChannelForChannelName(channel_name);

		var error = new UnableToJoinChannelError(
			channel_name,
			ErrorReasons.UNAUTHORIZED
		);

		desired_channel.dispatchJoinCallbacks(error);
	}

	handleNoPrivilegesMessage(message) {
		// TODO:
		// Wire this up to the relevant command callbacks
		this.emit(ServerConnectionEvents.CONNECTION_ERROR, message.toError());
	}

	handlePingMessage(ping_message) {
		var
			pong_message = new PongMessage(),
			hostname     = ping_message.getRemoteServerDetails().getHostname();

		pong_message.getRemoteServerDetails().setHostname(hostname);

		this.sendMessage(pong_message);
	}

	handleTopicMessage(message) {
		this.getChannelForMessage(message).handleTopicMessage(message);
	}

	handleMotdMessage(message) {
		this.getRemoteServerDetails().handleMotdMessage(message);
	}

	handleMotdStartMessage(message) {
		this.getRemoteServerDetails().handleMotdStartMessage(message);
	}

	handleEndOfMotdMessage(message) {
		this.getRemoteServerDetails().handleEndOfMotdMessage(message);
	}

	handleNoSuchNickMessage(message) {
		// Some IRCD's send what *should* be ERR_NOSUCHCHANNEL replies
		// back using this numeric. If that happens, we should transparently
		// create an actual ERR_NOSUCHCHANNEL message and give it the necessary
		// parameters before processing it.
		if (message.hasChannelName()) {
			let new_message = new NoSuchChannelMessage();

			new_message.setChannelName(message.getChannelName());

			return void this.handleNoSuchChannelMessage(new_message);
		}

		var user_details = this.getTargetUserDetailsForMessage(message);

		user_details.handleNoSuchNickMessage(message);
	}

	handleNoSuchChannelMessage(message) {
		var channel = this.getOrCreateChannelForMessage(message);

		channel.dispatchJoinCallbacks(message.toError());

		// TODO: Destroy the local channel instance?
	}

	handleNoMotdMessage(message) {
		this.getRemoteServerDetails().handleNoMotdMessage(message);
	}

	handleErroneousNicknameMessage(message) {
		var user_details = this.getUserDetailsForMessage(message);

		user_details.handleErroneousNicknameMessage(message);
	}

	handleNicknameInUseMessage(message) {
		var user_details = this.getUserDetailsForMessage(message);

		user_details.handleNicknameInUseMessage(message);
	}

	handleNotOnChannelMessage(message) {
		var channel = this.getOrCreateChannelForMessage(message);

		channel.handleNotOnChannelMessage(message);
	}

	handleNotRegisteredMessage(message) {
		this.emit(ServerConnectionEvents.CONNECTION_ERROR, message.toError());
	}

	handleNeedMoreParametersMessage(message) {
		var command = message.getAttemptedCommand();

		switch (command) {
			case Commands.MODE:
				return this.handleNeedMoreModeParametersMessage(message);

			default:
				throw new Error(`
					Unsupported command when handling ERR_NEEDMOREPARAMS:
					${command}
				`);
		}
	}

	handleNeedMoreModeParametersMessage(message) {
		if (message.hasChannelTarget()) {
			return this.handleNeedMoreChannelModeParametersMessage(message);
		} else if (message.hasUserTarget()) {
			return this.handleNeedMoreUserModeParametersMessage(message);
		} else {
			throw new Error(`
				No target specified when handling ERR_NEEDMOREPARAMS:
				${message.raw_message}
			`);
		}
	}

	handleNeedMoreChannelModeParametersMessage(message) {
		var channel = this.getOrCreateChannelForMessage(message);

		channel.handleNeedMoreModeParametersMessage(message);
	}

	handleNeedMoreUserModeParametersMessage(message) {
		var user = this.getUserDetailsForMessage(message);

		user.handleNeedMoreModeParametersMessage(message);
	}

	getUserDetailsForMessage(message) {
		return this.getUserDetailsRegistry().getUserDetailsForMessage(message);
	}

	getUserDetailsForNick(nick) {
		var registry = this.getUserDetailsRegistry();

		return registry.getOrStoreUserDetailsForNick(nick);
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
		channel_name = ChannelDetails.standardizeName(channel_name);

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

		var message = new JoinMessage();

		message.addChannelName(channel_name);
		this.sendMessage(message);
	}

	leaveChannelName(channel_name, callback) {
		if (!this.isWithinChannelName(channel_name)) {
			return void callback(new NotOnChannelError(channel_name));
		}

		var channel = this.getChannelForChannelName(channel_name);

		if (callback) {
			channel.addPartCallback(callback);
		}

		var message = new PartMessage();

		message.addChannelName(channel_name);
		this.sendMessage(message);
	}

	getRandomChannel() {
		return random(this.channels);
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
		PrivateMessage.getMultipleChannelMessages({
			body:         text,
			channel_name: channel_name
		}).forEach(this.sendMessage, this);
	}

	sendTextToUser(text, user_details) {
		return this.sendTextToUserByNick(text, user_details.getNick());
	}

	sendTextToUserByNick(text, nick) {
		PrivateMessage.getMultipleUserMessages({
			body: text,
			nick: nick
		}).forEach(this.sendMessage, this);
	}

	setTopicForChannelName(topic, channel_name) {
		var message = new TopicMessage();

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

		var message = new WhoisMessage();

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

		var server_details = this.getRemoteServerDetails();

		var socket = Net.createConnection({
			host: server_details.getHostname(),
			port: server_details.getPort()
		});

		this.setSocket(socket);

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

		this.once(ConnectionEvents.CONNECTION_SUCCESS, handleSuccess);
		this.once(ConnectionEvents.CONNECTION_FAILURE, handleFailure);
	}

	bindChannelHandlers() {
		this.handleChannelMessage = this.handleChannelMessage.bind(this);
	}

	handleSocketConnect() {
		super.handleSocketConnect();

		this.sendRegistrationMessages();
	}

	sendMessage(message) {
		if (!(message instanceof CommandMessage)) {
			throw new InvalidCommandMessageError(
				message,
				ErrorReasons.UNKNOWN_TYPE
			);
		}

		message.setOmitPrefix(true);

		return super.sendMessage(message);
	}

	sendRegistrationMessages() {
		// If a password is specified, it should be sent before the
		// nick or user messages.
		if (this.password) {
			let password_message = new PasswordMessage();

			password_message.setPassword(this.password);

			this.sendMessage(password_message);
		}

		var
			nick_message = new NickMessage(),
			user_message = new UserMessage(),
			user_details = this.getUserDetails();

		nick_message.setNickname(user_details.getNickname());

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
		var server_details = this.getRemoteServerDetails();

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

	channels:              null,
	channels_by_name:      null,

	user_details_registry: null,
	user_details:          null,
	server_details:        null

});


module.exports = ServerConnection;

