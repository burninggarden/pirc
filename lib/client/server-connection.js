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
	Connection          = req('/lib/connection'),
	Channel             = req('/lib/client/channel'),
	Replies             = req('/lib/constants/replies'),
	Commands            = req('/lib/constants/commands'),
	ConnectionEvents    = req('/lib/constants/connection-events'),
	UserDetailsRegistry = req('/lib/client/registries/user-details'),
	CommandMessage      = req('/lib/messages/command'),
	TargetTypes         = req('/lib/constants/target-types'),
	UserDetails         = req('/lib/user-details'),
	ServerDetails       = req('/lib/server-details'),
	ChannelDetails      = req('/lib/channel-details'),
	ChannelModes        = req('/lib/constants/channel-modes'),
	ConnectionEvents    = req('/lib/constants/connection-events'),
	TextFormatter       = req('/lib/utilities/text-formatter');


var
	JoinMessage    = req('/lib/messages/commands/join'),
	PartMessage    = req('/lib/messages/commands/part'),
	PrivateMessage = req('/lib/messages/commands/private'),
	PassMessage    = req('/lib/messages/commands/pass'),
	NickMessage    = req('/lib/messages/commands/nick'),
	ModeMessage    = req('/lib/messages/commands/mode'),
	UserMessage    = req('/lib/messages/commands/user'),
	TopicMessage   = req('/lib/messages/commands/topic'),
	PongMessage    = req('/lib/messages/commands/pong'),
	WhoisMessage   = req('/lib/messages/commands/whois'),
	OperMessage    = req('/lib/messages/commands/oper'),
	QuitMessage    = req('/lib/messages/commands/quit');

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

		if (parameters.hostname !== undefined) {
			server_details.setHostname(parameters.hostname);
		}

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

		if (parameters.log_inbound_messages) {
			this.setLogInboundMessages(parameters.log_inbound_messages);
		}

		if (parameters.log_outbound_messages) {
			this.setLogOutboundMessages(parameters.log_outbound_messages);
		}

		if (parameters.autoregister === false) {
			this.setAutoregister(false);
		}

		this.channels         = [ ];
		this.channels_by_name = { };

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
			this.getUserDetailsRegistry().storeUserDetails(this.user_details);
		}

		return this.user_details;
	}

	getNickname() {
		return this.getUserDetails().getNickname();
	}

	getUserId() {
		return this.getUserDetails().getUserId();
	}

	setUserId(user_id) {
		return this.getUserDetails().setUserId(user_id);
	}

	setSSL(ssl) {
		this.validateSSL(ssl);

		this.ssl = ssl;

		throw new Error('Not yet implemented: SSL support');
	}

	getSSL() {
		this.validateSSL(this.ssl);
		return this.ssl;
	}

	validateSSL(ssl) {
		if (!isBoolean(ssl)) {
			throw new Error('Invalid server ssl setting: ' + ssl);
		}
	}

	handleInboundMessage(message) {
		message.parseParameters();

		this.emit(ConnectionEvents.INCOMING_MESSAGE, message);

		if (message.hasReply()) {
			this.handleReplyMessage(message);
		} else if (message.hasCommand()) {
			this.handleCommandMessage(message);
		} else {
			throw new Error(`
				Invalid message received; neither a reply nor command:
				${message.getRawMessage()}
			`);
		}
	}

	handleError(error) {
		throw error;
	}

	handleReplyMessage(message) {
		var reply = message.getReply();

		switch (reply) {
			case Replies.RPL_WELCOME:
				return this.handleWelcomeMessage(message);

			case Replies.RPL_YOURHOST:
				// Noop.
				return;

			case Replies.RPL_CREATED:
				// Noop.
				return;

			case Replies.RPL_MYINFO:
				return this.handleServerInfoMessage(message);

			case Replies.RPL_ISUPPORT:
				// TODO: Implement this, noop for now.
				return;

			case Replies.RPL_UMODEIS:
				// TODO: Implement this, noop for now.
				return;

			case Replies.RPL_STATSDLINE:
				// Noop.
				return;

			case Replies.RPL_LUSERCLIENT:
				// TODO: Implement this, noop for now.
				return;

			case Replies.RPL_LUSEROP:
				return this.handleLUserOpMessage(message);

			case Replies.RPL_LUSERUNKNOWN:
				return this.handleLUserUnknownMessage(message);

			case Replies.RPL_LUSERCHANNELS:
				return this.handleLUserChannelsMessage(message);

			case Replies.RPL_LUSERME:
				// Noop.
				return;

			case Replies.RPL_LOCALUSERS:
				return this.handleLocalUsersMessage(message);

			case Replies.RPL_GLOBALUSERS:
				return this.handleGlobalUsersMessage(message);

			case Replies.RPL_AWAY:
				return this.handleAwayMessage(message);

			case Replies.RPL_WHOISUSER:
				return this.handleWhoisUserMessage(message);

			case Replies.RPL_WHOISSERVER:
				return this.handleWhoisServerMessage(message);

			case Replies.RPL_WHOISIDLE:
				return this.handleWhoisIdleMessage(message);

			case Replies.RPL_ENDOFWHOIS:
				return this.handleEndOfWhoisMessage(message);

			case Replies.RPL_WHOISCHANNELS:
				return this.handleWhoisChannelsMessage(message);

			case Replies.RPL_CHANNEL_URL:
				return this.handleChannelUrlMessage(message);

			case Replies.RPL_WHOISACCOUNT:
				return this.handleWhoisAccountMessage(message);

			case Replies.RPL_NOTOPIC:
				return this.handleChannelNoTopicMessage(message);

			case Replies.RPL_TOPIC:
				return this.handleChannelTopicMessage(message);

			case Replies.RPL_TOPICWHOTIME:
				return this.handleChannelTopicDetailsMessage(message);

			case Replies.RPL_NAMREPLY:
				return this.handleChannelNamesReplyMessage(message);

			case Replies.RPL_ENDOFNAMES:
				return this.handleChannelEndOfNamesMessage(message);

			case Replies.RPL_MOTD:
				return this.handleMotdMessage(message);

			case Replies.RPL_MOTDSTART:
				return this.handleMotdStartMessage(message);

			case Replies.RPL_ENDOFMOTD:
				return this.handleEndOfMotdMessage(message);

			case Replies.RPL_YOUREOPER:
				return this.handleYouAreOperatorMessage(message);

			case Replies.RPL_WHOISHOST:
				return this.handleWhoisHostMessage(message);

			case Replies.RPL_WHOISMODES:
				return this.handleWhoisModeMessage(message);

			case Replies.ERR_NOSUCHNICK:
				return this.handleNoSuchNickMessage(message);

			case Replies.ERR_NOSUCHCHANNEL:
				return this.handleNoSuchChannelMessage(message);

			case Replies.ERR_NOMOTD:
				return this.handleNoMotdMessage(message);

			case Replies.ERR_NONICKNAMEGIVEN:
				return this.handleNoNicknameGivenMessage(message);

			case Replies.ERR_ERRONEUSNICKNAME:
				return this.handleErroneousNicknameMessage(message);

			case Replies.ERR_NICKNAMEINUSE:
				return this.handleNicknameInUseMessage(message);

			case Replies.ERR_NOTONCHANNEL:
				return this.handleNotOnChannelMessage(message);

			case Replies.ERR_NOTREGISTERED:
				return this.handleNotRegisteredMessage(message);

			case Replies.ERR_NEEDMOREPARAMS:
				return this.handleNeedMoreParametersMessage(message);

			case Replies.ERR_ALREADYREGISTRED:
				return this.handleAlreadyRegisteredMessage(message);

			case Replies.ERR_PASSWDMISMATCH:
				return this.handlePasswordMismatchMessage(message);

			case Replies.ERR_LINKCHANNEL:
				return this.handleLinkChannelMessage(message);

			case Replies.ERR_CHANNELISFULL:
				return this.handleChannelIsFullMessage(message);

			case Replies.ERR_UNKNOWNMODE:
				return this.handleUnknownModeMessage(message);

			case Replies.ERR_INVITEONLYCHAN:
				return this.handleInviteOnlyChannelMessage(message);

			case Replies.ERR_NEEDREGGEDNICK:
				return this.handleNeedReggedNickMessage(message);

			case Replies.ERR_CHANOPRIVSNEEDED:
				return this.handleChannelOperatorPrivilegesNeededMessage(
					message
				);

			case Replies.ERR_RESTRICTED:
				return this.handleRestrictedMessage(message);

			case Replies.ERR_UMODEUNKNOWNFLAG:
				return this.handleUserModeUnknownFlagMessage(message);

			case Replies.ERR_USERSDONTMATCH:
				// TODO: this; noop for now.
				return;

			case Replies.RPL_WHOISSECURE:
				return this.handleWhoisSecureMessage(message);

			default:
				throw new Error(
					`Not yet implemented: message handling for reply ${reply}`
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
				if (message.hasChannelMessageTargets()) {
					return this.handleChannelPrivateMessage(message);
				} else if (message.hasUserMessageTargets()) {
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
		var channel_names = message.getChannelNames();

		if (channel_names.length > 1) {
			throw new Error('invalid channel names in join message');
		}

		var channel = this.getChannelForMessage(message);

		channel.handleJoinMessage(message);
	}

	handleModeMessage(message) {
		try {
			message.validate();
		} catch (error) {
			this.emit(ConnectionEvents.CONNECTION_ERROR, error);
		}

		switch (message.getTargetType()) {
			case TargetTypes.CHANNEL:
				return this.handleChannelModeMessage(message);

			case TargetTypes.USER:
				return this.handleUserModeMessage(message);

			default:
				throw new Error('Invalid mode message: ' + message.raw_message);
		}
	}

	handleChannelModeMessage(message) {
		var channel = this.getChannelForMessage(message);

		channel.handleModeMessage(message);

		if (message.getOriginUserId() === this.getUserId()) {
			channel.dispatchModeChangeCallbacks();
		}
	}

	handleUserModeMessage(message) {
		this.getUserDetailsForMessage(message).handleModeMessage(message);
	}

	handleNickMessage(message) {
		this.getUserDetailsForMessage(message).handleNickMessage(message);
	}

	handlePartMessage(message) {
		var channel_names = message.getChannelNames();

		if (channel_names.length > 1) {
			throw new Error('invalid channel names in join message');
		}

		var channel = this.getChannelForMessage(message);

		channel.handlePartMessage(message);

		if (message.getOriginUserId() === this.getUserId()) {
			this.destroyChannel(channel);
		}
	}

	handleQuitMessage(message) {
		this.channels.forEach(function each(channel) {
			channel.handleQuitMessage(message);
		});
	}

	handleChannelPrivateMessage(message) {
		var channel_targets = message.getChannelMessageTargets();

		channel_targets.forEach(function each(target) {
			this.getChannelForChannelName(target).handlePrivateMessage(message);
		}, this);
	}

	handleUserPrivateMessage(message) {
		// Noop for now.
	}

	handleWelcomeMessage(message) {
		this.setUserId(message.getUserId());
		this.setIsRegistered(true);
		this.emit(ConnectionEvents.REGISTRATION_SUCCESS);
	}

	handlePasswordMismatchMessage(message) {
		let error = new Error('Invalid password');

		if (!this.isRegistered()) {
			this.emit(ConnectionEvents.REGISTRATION_FAILURE, error);
		} else {
			this.getUserDetails().dispatchOperatorCallbacks(error);
		}
	}

	handleServerInfoMessage(message) {
		var server_details = this.getRemoteServerDetails();

		server_details.setHostname(message.getHostname());
		server_details.setVersion(message.getServerVersion());
		server_details.setUserModes(message.getUserModes());
		server_details.setChannelModes(message.getChannelModes());
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

	handleChannelIsFullMessage(message) {
		this.getChannelForMessage(message).handleChannelIsFullMessage(message);
	}

	handleLinkChannelMessage(message) {
		this.getChannelForMessage(message).handleLinkChannelMessage(message);
	}

	handleUnknownModeMessage(message) {
		this.getChannelForMessage(message).handleUnknownModeMessage(message);
	}

	handleInviteOnlyChannelMessage(message) {
		this.getChannelForMessage(message).handleInviteOnlyMessage(message);
	}

	handleNeedReggedNickMessage(message) {
		this.getChannelForMessage(message).handleNeedReggedNickMessage(message);
	}

	handleChannelOperatorPrivilegesNeededMessage(message) {
		var channel_details = this.getChannelForMessage(message);

		channel_details.handleOperatorPrivilegesNeededMessage(message);
	}

	handleRestrictedMessage(message) {
		var
			user_details = this.getUserDetails(),
			error        = new Error('You are on a restricted connection');

		user_details.dispatchNickCallbacks(error);
	}

	handleUserModeUnknownFlagMessage(message) {
		let error = new Error('Unknown mode flag');

		this.getUserDetails().dispatchModeChangeCallbacks(error);
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

	handleYouAreOperatorMessage(message) {
		this.getUserDetails().handleYouAreOperatorMessage(message);
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

		var
			nickname     = message.getNickname(),
			user_details = this.getUserDetailsForNickname(nickname);

		user_details.handleNoSuchNickMessage(message);
	}

	handleNoSuchChannelMessage(message) {
		var channel = this.getOrCreateChannelForMessage(message);

		channel.handleNoSuchChannelMessage(message);

		this.destroyChannel(channel);
	}

	handleNoMotdMessage(message) {
		this.getRemoteServerDetails().handleNoMotdMessage(message);
	}

	handleNoNicknameGivenMessage(message) {
		var user_details = this.getUserDetailsForMessage(message);

		user_details.handleNoNicknameGivenMessage(message);
	}

	handleErroneousNicknameMessage(message) {
		var user_details = this.getUserDetailsForMessage(message);

		user_details.handleErroneousNicknameMessage(message);
	}

	handleNicknameInUseMessage(message) {
		var user_details = this.getUserDetails();

		user_details.handleNicknameInUseMessage(message);
	}

	handleNotOnChannelMessage(message) {
		var channel = this.getOrCreateChannelForMessage(message);

		channel.handleNotOnChannelMessage(message);
	}

	handleNotRegisteredMessage(message) {
		throw new Error('implement');
	}

	handleNeedMoreParametersMessage(message) {
		var command = message.getAttemptedCommand();

		switch (command) {
			case Commands.MODE:
				return this.handleNeedMoreModeParametersMessage(message);

			case Commands.PASS:
				return this.handleNeedMorePassParametersMessage(message);

			case Commands.USER:
				return this.handleNeedMoreUserParametersMessage(message);

			case Commands.OPER:
				return this.handleNeedMoreOperParametersMessage(message);

			default:
				throw new Error(`
					Unsupported command when handling ERR_NEEDMOREPARAMS:
					${command}
				`);
		}
	}

	handleNeedMoreModeParametersMessage(message) {
		// TODO: Reimplement callback handling for this type of error
		console.log(message.getRawMessage());
	}

	handleNeedMorePassParametersMessage(message) {
		var error = new Error('Must supply a password');

		this.emit(ConnectionEvents.REGISTRATION_FAILURE, error);
	}

	handleNeedMoreUserParametersMessage(message) {
		var error = new Error('Invalid user details');

		this.emit(ConnectionEvents.REGISTRATION_FAILURE, error);
	}

	handleNeedMoreChannelModeParametersMessage(message) {
		var channel = this.getOrCreateChannelForMessage(message);

		channel.handleNeedMoreModeParametersMessage(message);
	}

	handleNeedMoreUserModeParametersMessage(message) {
		var user = this.getUserDetailsForMessage(message);

		user.handleNeedMoreModeParametersMessage(message);
	}

	handleNeedMoreOperParametersMessage(message) {
		var user = this.getUserDetailsForMessage(message);

		user.handleNeedMoreOperParametersMessage(message);
	}

	handleAlreadyRegisteredMessage(message) {
		// TODO: Figure out what to do in this case...
		console.log(message.getRawMessage());
	}

	getUserDetailsForMessage(message) {
		return this.getUserDetailsRegistry().getUserDetailsForMessage(message);
	}

	getUserDetailsForNickname(nickname) {
		var registry = this.getUserDetailsRegistry();

		return registry.getOrStoreUserDetailsForNickname(nickname);
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
		channel.destroy();
	}

	getOrCreateChannelForMessage(message) {
		return this.getOrCreateChannelForChannelName(message.getChannelName());
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

	getOrCreateChannelForChannelName(channel_name) {
		return (
			   this.getChannelForChannelName(channel_name)
			|| this.createChannelForChannelName(channel_name)
		);
	}

	getChannelForMessage(message) {
		return this.getOrCreateChannelForChannelName(message.getChannelName());
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

	joinChannelNameWithKey(channel_name, key, callback) {
		if (this.isWithinChannelName(channel_name)) {
			let error = new Error(`
				Already in channel: ${channel_name}
			`);

			return deferOrThrow(callback, error);
		}

		var channel = this.createChannelForChannelName(channel_name);

		if (callback) {
			channel.addJoinCallback(callback);
		}

		var message = new JoinMessage();

		message.addChannelName(channel_name);

		if (key) {
			message.setChannelKey(channel_name, key);
		}

		this.sendMessage(message);
	}

	leaveChannelName(channel_name, callback) {
		if (!this.isWithinChannelName(channel_name)) {
			let error = new Error(`
				Not on channel: ${channel_name}
			`);

			return void callback(error);
		}

		var channel = this.getChannelForChannelName(channel_name);

		if (callback) {
			channel.addPartCallback(callback);
		}

		var message = new PartMessage();

		message.addChannelName(channel_name);
		this.sendMessage(message);
	}

	setKeyForChannelName(key, channel_name, callback) {
		if (!this.isWithinChannelName(channel_name)) {
			let error = new Error(`
				Not on channel: ${channel_name}
			`);

			return void callback(error);
		}

		var channel = this.getChannelForChannelName(channel_name);

		if (callback) {
			channel.addModeChangeCallback(callback);
		}

		var message = new ModeMessage();

		message.setChannelName(channel_name);
		message.addMode(ChannelModes.KEY, [key]);

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
		return this.sendTextToUserByNick(text, user_details.getNickname());
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
		if (!this.user_details_registry) {
			this.user_details_registry = new UserDetailsRegistry();
		}

		return this.user_details_registry;
	}

	getUserDetailsForMessage(message) {
		return this.getUserDetailsRegistry().getUserDetailsForMessage(
			message
		);
	}

	isRegistered() {
		return this.is_registered === true;
	}

	setIsRegistered(is_registered) {
		this.is_registered = is_registered;
		return this;
	}

	connect(callback) {
		if (!isFunction(callback)) {
			throw new Error('Must supply a valid callback');
		}

		if (this.isConnected()) {
			let error = new Error('Already connected');

			return void defer(callback, error);
		}

		var
			server_details = this.getRemoteServerDetails(),
			hostname;

		if (server_details.hasHostname()) {
			hostname = server_details.getHostname();
		} else {
			hostname = 'localhost';
		}

		var socket = Net.createConnection({
			host: hostname,
			port: server_details.getPort()
		});

		this.setSocket(socket);

		function handleSuccess() {
			this.removeListener(
				ConnectionEvents.CONNECTION_FAILURE,
				handleFailure
			);

			return void callback(null, this);
		}

		function handleFailure(error) {
			this.removeListener(
				ConnectionEvents.CONNECTION_SUCCESS,
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

		if (this.shouldAutoregister()) {
			this.sendRegistrationMessages();
		}
	}

	sendMessage(message) {
		if (!(message instanceof CommandMessage)) {
			throw new Error(`
				Invalid message, expected command
			`);
		}

		message.setOmitPrefix(true);

		return super.sendMessage(message);
	}

	shouldAutoregister() {
		return this.autoregister;
	}

	setAutoregister(autoregister) {
		this.autoregister = autoregister;
		return this;
	}

	sendRegistrationMessages() {
		// If a password is specified, it should be sent before the
		// nick or user messages.
		if (this.hasPassword()) {
			let password_message = new PassMessage();

			password_message.setPassword(this.getPassword());

			this.sendMessage(password_message);
		}

		var user_details = this.getUserDetails();

		this.sendNickMessage(user_details.getNickname());

		var user_message = (new UserMessage())
			.setUsername(user_details.getUsername())
			.setRealname(user_details.getRealname())
			.setModes(user_details.getModes());

		this.sendMessage(user_message);
	}

	changeNickname(nickname, callback) {
		if (isFunction(callback)) {
			this.getUserDetails().addNickCallback(callback);
		}

		this.sendNickMessage(nickname);
	}

	sendNickMessage(nickname) {
		var message = new NickMessage();

		message.setNickname(nickname);

		this.sendMessage(message);
	}

	handleChannelMessage(message) {
		// Noop for now.
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

	getOutboundLogPrefix() {
		return TextFormatter.cyan('[C] SEND: ');
	}

	getInboundLogPrefix() {
		return TextFormatter.yellow('[C] RECV: ');
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

	isRestricted() {
		return this.getUserDetails().isRestricted();
	}

	registerAsOperator(username, password, callback) {
		var message = new OperMessage();

		message.setUsername(username);
		message.setPassword(password);

		this.getUserDetails().addOperatorCallback(callback);
		this.sendMessage(message);
	}

	addUserMode(user_mode, callback) {
		var message = new ModeMessage();

		message.addUserMode(user_mode);
		message.setNickname(this.getNickname());

		this.sendMessage(message);
		this.getUserDetails().addModeChangeCallback(callback);
	}

	removeUserMode(user_mode, callback) {
		var message = new ModeMessage();

		message.removeUserMode(user_mode);
		message.setNickname(this.getNickname());

		this.sendMessage(message);
		this.getUserDetails().addModeChangeCallback(callback);
	}

	quit(quit_message, callback) {
		var message = new QuitMessage();

		message.setText(quit_message);

		this.sendMessage(message);

		this.addDisconnectCallback(callback);
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
	server_details:        null,

	autoregister:          true

});


module.exports = ServerConnection;

