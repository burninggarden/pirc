var
	Net = require('net');

var
	defer        = req('/utilities/defer'),
	deferOrThrow = req('/utilities/defer-or-throw'),
	extend       = req('/utilities/extend'),
	has          = req('/utilities/has'),
	add          = req('/utilities/add'),
	remove       = req('/utilities/remove'),
	random       = req('/utilities/random'),
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
	NotOnChannelError         = req('/lib/errors/not-on-channel'),
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

var
	ServerNoSuchChannelMessage = req('/lib/server/messages/no-such-channel');


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
			// 001
			case ReplyNumerics.RPL_WELCOME:
				return this.handleWelcomeMessage(message);

			// 002
			case ReplyNumerics.RPL_YOURHOST:
				// Noop.
				return;

			// 003
			case ReplyNumerics.RPL_CREATED:
				// Noop.
				return;

			// 004
			case ReplyNumerics.RPL_MYINFO:
				return this.handleServerInfoMessage(message);

			// 005
			case ReplyNumerics.RPL_ISUPPORT:
				// TODO: Implement this, noop for now.
				return;

			// 042
			case ReplyNumerics.RPL_YOURID:
				return this.handleYourIdMessage(message);

			// 250
			case ReplyNumerics.RPL_STATSCONN:
				// Noop.
				return;

			// 251
			case ReplyNumerics.RPL_LUSERCLIENT:
				// TODO: Implement this, noop for now.
				return;

			// 252
			case ReplyNumerics.RPL_LUSEROP:
				return this.handleLUserOpMessage(message);

			// 253
			case ReplyNumerics.RPL_LUSERUNKNOWN:
				return this.handleLUserUnknownMessage(message);

			// 254
			case ReplyNumerics.RPL_LUSERCHANNELS:
				return this.handleLUserChannelsMessage(message);

			// 255
			case ReplyNumerics.RPL_LUSERME:
				// Noop.
				return;

			// 265
			case ReplyNumerics.RPL_LOCALUSERS:
				return this.handleLocalUsersMessage(message);

			// 266
			case ReplyNumerics.RPL_GLOBALUSERS:
				return this.handleGlobalUsersMessage(message);

			// 301
			case ReplyNumerics.RPL_AWAY:
				return this.handleAwayMessage(message);

			// 311
			case ReplyNumerics.RPL_WHOISUSER:
				return this.handleWhoisUserMessage(message);

			// 312
			case ReplyNumerics.RPL_WHOISSERVER:
				return this.handleWhoisServerMessage(message);

			// 317
			case ReplyNumerics.RPL_WHOISIDLE:
				return this.handleWhoisIdleMessage(message);

			// 318
			case ReplyNumerics.RPL_ENDOFWHOIS:
				return this.handleEndOfWhoisMessage(message);

			// 319
			case ReplyNumerics.RPL_WHOISCHANNELS:
				return this.handleWhoisChannelsMessage(message);

			// 328
			case ReplyNumerics.RPL_CHANNEL_URL:
				return this.handleChannelUrlMessage(message);

			// 330
			case ReplyNumerics.RPL_WHOISACCOUNT:
				return this.handleWhoisAccountMessage(message);

			// 331
			case ReplyNumerics.RPL_NOTOPIC:
				return this.handleChannelNoTopicMessage(message);

			// 332
			case ReplyNumerics.RPL_TOPIC:
				return this.handleChannelTopicMessage(message);

			// 333
			case ReplyNumerics.RPL_TOPICWHOTIME:
				return this.handleChannelTopicDetailsMessage(message);

			// 353
			case ReplyNumerics.RPL_NAMREPLY:
				return this.handleChannelNamesReplyMessage(message);

			// 366
			case ReplyNumerics.RPL_ENDOFNAMES:
				return this.handleChannelEndOfNamesMessage(message);

			// 372
			case ReplyNumerics.RPL_MOTD:
				return this.handleMotdMessage(message);

			// 375
			case ReplyNumerics.RPL_MOTDSTART:
				return this.handleMotdStartMessage(message);

			// 376
			case ReplyNumerics.RPL_ENDOFMOTD:
				return this.handleEndOfMotdMessage(message);

			// 378
			case ReplyNumerics.RPL_WHOISHOST:
				return this.handleWhoisHostMessage(message);

			// 379
			case ReplyNumerics.RPL_WHOISMODES:
				return this.handleWhoisModeMessage(message);

			// 401
			case ReplyNumerics.ERR_NOSUCHNICK:
				return this.handleNoSuchNickMessage(message);

			// 403
			case ReplyNumerics.ERR_NOSUCHCHANNEL:
				return this.handleNoSuchChannelMessage(message);

			// 422
			case ReplyNumerics.ERR_NOMOTD:
				return this.handleNoMotdMessage(message);

			// 432
			case ReplyNumerics.ERR_ERRONEUSNICKNAME:
				return this.handleErroneousNicknameMessage(message);

			// 433
			case ReplyNumerics.ERR_NICKNAMEINUSE:
				return this.handleNicknameInUseMessage(message);

			// 442
			case ReplyNumerics.ERR_NOTONCHANNEL:
				return this.handleNotOnChannelMessage(message);

			// 451
			case ReplyNumerics.ERR_NOTREGISTERED:
				return this.handleNotRegisteredMessage(message);

			// 461
			case ReplyNumerics.ERR_NEEDMOREPARAMS:
				return this.handleNeedMoreParamsMessage(message);

			// 470
			case ReplyNumerics.ERR_LINKCHANNEL:
				return this.handleLinkChannelMessage(message);

			// 471
			case ReplyNumerics.ERR_CHANNELISFULL:
				return this.handleChannelIsFullMessage(message);

			// 472
			case ReplyNumerics.ERR_UNKNOWNMODE:
				return this.handleUnknownModeMessage(message);

			// 477
			case ReplyNumerics.ERR_NEEDREGGEDNICK:
				return this.handleNeedReggedNickMessage(message);

			// 481
			case ReplyNumerics.ERR_NOPRIVILEGES:
				return this.handleNoPrivilegesMessage(message);

			// 501
			case ReplyNumerics.ERR_UMODEUNKNOWNFLAG:
				// return this.handleUModeUnknownFlagMessage(message);
				// Noop for now:
				return;

			// 671
			case ReplyNumerics.RPL_WHOISSECURE:
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
			pong_message = new ClientPongMessage(),
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
			let new_message = new ServerNoSuchChannelMessage();

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

	handleNeedMoreParamsMessage(message) {
		var command = message.getAttemptedCommand();

		switch (command) {
			case Commands.MODE:
				return this.handleNeedMoreModeParamsMessage(message);

			default:
				throw new Error(`
					Unsupported command when handling ERR_NEEDMOREPARAMS:
					${command}
				`);
		}
	}

	handleNeedMoreModeParamsMessage(message) {
		if (message.hasChannelTarget()) {
			return this.handleNeedMoreChannelModeParamsMessage(message);
		} else if (message.hasUserTarget()) {
			return this.handleNeedMoreUserModeParamsMessage(message);
		} else {
			throw new Error(`
				No target specified when handling ERR_NEEDMOREPARAMS:
				${message.raw_message}
			`);
		}
	}

	handleNeedMoreChannelModeParamsMessage(message) {
		var channel = this.getOrCreateChannelForMessage(message);

		channel.handleNeedMoreModeParamsMessage(message);
	}

	handleNeedMoreUserModeParamsMessage(message) {
		var user = this.getUserDetailsForMessage(message);

		user.handleNeedMoreModeParamsMessage(message);
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

		var message = new ClientJoinMessage();

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

		var message = new ClientPartMessage();

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
		ClientPrivateMessage.getMultipleChannelMessages({
			body:         text,
			channel_name: channel_name
		}).forEach(this.sendMessage, this);
	}

	sendTextToUser(text, user_details) {
		return this.sendTextToUserByNick(text, user_details.getNick());
	}

	sendTextToUserByNick(text, nick) {
		ClientPrivateMessage.getMultipleUserMessages({
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

		var server_details = this.getRemoteServerDetails();

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
		this.emit(ServerConnectionEvents.CONNECTION_DATA, data);

		var data_string = data.toString('utf8');

		if (this.hasMessageRemainder()) {
			data_string = this.getMessageRemainder() + data_string;
		}

		var index = data_string.indexOf(Delimiters.CRLF);

		while (index !== -1) {
			let message = data_string.slice(0, index);

			this.handleInboundMessage(message);

			data_string = data_string.slice(index + Delimiters.CRLF.length);
			index = data_string.indexOf(Delimiters.CRLF);
		}

		if (data_string.length > 0) {
			this.setMessageRemainder(data_string);
		} else {
			this.clearMessageRemainder();
		}
	}

	handleInboundMessage(message) {
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
		this.sendRegistrationMessages();
	}

	handleSocketError(error) {
		this.emit(ServerConnectionEvents.CONNECTION_FAILURE, error);
	}

	handleSocketEnd() {
		this.connected = false;
		this.unbindSocketEvents();
		this.emit(ServerConnectionEvents.CONNECTION_END);
	}

	handleSocketClose() {
		this.handleSocketEnd();
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
	connected:             false,

	channels:              null,
	channels_by_name:      null,

	user_details_registry: null,
	user_details:          null,
	server_details:        null,

	message_remainder:     null

});


module.exports = ServerConnection;

