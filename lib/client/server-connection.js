
var
	defer               = require('../utility/defer'),
	extend              = require('../utility/extend'),
	has                 = require('../utility/has'),
	add                 = require('../utility/add'),
	remove              = require('../utility/remove'),
	random              = require('../utility/random'),
	truncate            = require('../utility/truncate'),
	isBoolean           = require('../utility/is-boolean'),
	getCurrentTimestamp = require('../utility/get-current-timestamp'),
	TextFormatter       = require('../utility/text-formatter');


var
	Connection                  = require('../connection'),
	Client_Channel              = require('./channel'),
	Client_Registry_UserDetails = require('./registry/user-details'),
	Message_Command             = require('../message/command'),
	UserDetails                 = require('../user-details'),
	ServerDetails               = require('../server-details'),
	ChannelDetails              = require('../channel-details');

var
	Enum_Replies          = require('../enum/replies'),
	Enum_Commands         = require('../enum/commands'),
	Enum_ConnectionEvents = require('../enum/connection-events'),
	Enum_TargetTypes      = require('../enum/target-types'),
	Enum_ChannelModes     = require('../enum/channel-modes');

var
	Message_Command_Away    = require('../message/command/away'),
	Message_Command_Connect = require('../message/command/connect'),
	Message_Command_Join    = require('../message/command/join'),
	Message_Command_Mode    = require('../message/command/mode'),
	Message_Command_Nick    = require('../message/command/nick'),
	Message_Command_Oper    = require('../message/command/oper'),
	Message_Command_Part    = require('../message/command/part'),
	Message_Command_Pass    = require('../message/command/pass'),
	Message_Command_Pong    = require('../message/command/pong'),
	Message_Command_Private = require('../message/command/private'),
	Message_Command_Quit    = require('../message/command/quit'),
	Message_Command_Restart = require('../message/command/restart'),
	Message_Command_Topic   = require('../message/command/topic'),
	Message_Command_User    = require('../message/command/user'),
	Message_Command_Whois   = require('../message/command/whois');

var
	Message_Reply_NoSuchChannel = require('../message/reply/no-such-channel');


const
	DEFAULT_PORT     = 6667,
	DEFAULT_SSL      = false,
	DEFAULT_USERNAME = 'pirc',
	DEFAULT_REALNAME = 'pirc',
	DEFAULT_NICK     = 'pirc',
	HISTORY_LENGTH   = 100;


class Client_ServerConnection extends Connection {

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

		if (parameters.log_incoming_messages) {
			this.setLogIncomingMessages(parameters.log_incoming_messages);
		}

		if (parameters.log_outgoing_messages) {
			this.setLogOutgoingMessages(parameters.log_outgoing_messages);
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

	handleIncomingMessage(incoming_message) {
		incoming_message.parseParameters();

		if (incoming_message.hasReply()) {
			this.handleReplyMessage(incoming_message);
		} else if (incoming_message.hasCommand()) {
			this.handleCommandMessage(incoming_message);
		} else {
			throw new Error(`
				Invalid message received; neither a reply nor command:
				${incoming_message.getRawMessage()}
			`);
		}

		this.emit(
			Enum_ConnectionEvents.INCOMING_MESSAGE,
			this,
			incoming_message
		);

		this.dispatchCallbackForIncomingMessage(incoming_message);
	}

	handleError(error) {
		throw error;
	}

	handleReplyMessage(message) {
		var reply = message.getReply();

		switch (reply) {
			case Enum_Replies.RPL_WELCOME:
				return this.handleWelcomeMessage(message);

			case Enum_Replies.RPL_MYINFO:
				return this.handleServerInfoMessage(message);

			case Enum_Replies.RPL_LUSEROP:
				return this.handleLUserOpMessage(message);

			case Enum_Replies.RPL_LUSERUNKNOWN:
				return this.handleLUserUnknownMessage(message);

			case Enum_Replies.RPL_LUSERCHANNELS:
				return this.handleLUserChannelsMessage(message);

			case Enum_Replies.RPL_LOCALUSERS:
				return this.handleLocalUsersMessage(message);

			case Enum_Replies.RPL_GLOBALUSERS:
				return this.handleGlobalUsersMessage(message);

			case Enum_Replies.RPL_AWAY:
				return this.handleAwayMessage(message);

			case Enum_Replies.RPL_UNAWAY:
				return this.handleUnawayMessage(message);

			case Enum_Replies.RPL_NOWAWAY:
				return this.handleNowAwayMessage(message);

			case Enum_Replies.RPL_WHOISUSER:
				return this.handleWhoisUserMessage(message);

			case Enum_Replies.RPL_WHOISSERVER:
				return this.handleWhoisServerMessage(message);

			case Enum_Replies.RPL_WHOISIDLE:
				return this.handleWhoisIdleMessage(message);

			case Enum_Replies.RPL_ENDOFWHOIS:
				return this.handleEndOfWhoisMessage(message);

			case Enum_Replies.RPL_WHOISCHANNELS:
				return this.handleWhoisChannelsMessage(message);

			case Enum_Replies.RPL_CHANNEL_URL:
				return this.handleChannelUrlMessage(message);

			case Enum_Replies.RPL_WHOISACCOUNT:
				return this.handleWhoisAccountMessage(message);

			case Enum_Replies.RPL_NOTOPIC:
				return this.handleChannelNoTopicMessage(message);

			case Enum_Replies.RPL_TOPIC:
				return this.handleChannelTopicMessage(message);

			case Enum_Replies.RPL_TOPICWHOTIME:
				return this.handleChannelTopicDetailsMessage(message);

			case Enum_Replies.RPL_NAMREPLY:
				return this.handleChannelNamesReplyMessage(message);

			case Enum_Replies.RPL_ENDOFNAMES:
				return this.handleChannelEndOfNamesMessage(message);

			case Enum_Replies.RPL_MOTD:
				return this.handleMotdMessage(message);

			case Enum_Replies.RPL_WHOISHOST:
				return this.handleWhoisHostMessage(message);

			case Enum_Replies.RPL_WHOISMODES:
				return this.handleWhoisModeMessage(message);

			case Enum_Replies.RPL_WHOISSECURE:
				return this.handleWhoisSecureMessage(message);
		}
	}

	handleCommandMessage(message) {
		var command = message.getCommand();

		switch (command) {
			case Enum_Commands.JOIN:
				return this.handleJoinMessage(message);

			case Enum_Commands.MODE:
				return this.handleModeMessage(message);

			case Enum_Commands.NICK:
				return this.handleNickMessage(message);

			case Enum_Commands.PART:
				return this.handlePartMessage(message);

			case Enum_Commands.PRIVMSG:
				if (message.hasChannelMessageTargets()) {
					return this.handleChannelPrivateMessage(message);
				} else if (message.hasUserMessageTargets()) {
					return this.handleUserPrivateMessage(message);
				} else {
					throw new Error('wtf is this');
				}

			case Enum_Commands.PING:
				return this.handlePingMessage(message);

			case Enum_Commands.QUIT:
				return this.handleQuitMessage(message);

			case Enum_Commands.TOPIC:
				return this.handleTopicMessage(message);

			default:
				// Noop.
				return;
		}
	}

	dispatchCallbackForIncomingMessage(incoming_message) {
		var sent_message = this.getSentMessageForIncomingMessage(
			incoming_message
		);

		if (!sent_message) {
			return;
		}

		if (!sent_message.hasCallback()) {
			return;
		}

		var
			callback = sent_message.getCallback(),
			error    = this.getErrorForIncomingMessage(incoming_message),
			result   = this.getResultForIncomingMessage(incoming_message);

		callback(error, result);
	}

	/**
	 * @param   {Message} incoming_message
	 * @returns {Error|null}
	 */
	getErrorForIncomingMessage(incoming_message) {
		if (incoming_message.isErrorMessage()) {
			return incoming_message.toError();
		}

		return null;
	}

	/**
	 * @param   {Message} incoming_message
	 * @returns {mixed}
	 */
	getResultForIncomingMessage(incoming_message) {
		switch (incoming_message.getReply()) {
			case Enum_Replies.RPL_TOPIC:
				return incoming_message.getChannelTopic();

			case Enum_Replies.RPL_NOTOPIC:
				return '';
		}

		if (incoming_message.hasChannelName()) {
			return this.getChannelForChannelName(
				incoming_message.getChannelName()
			);
		}

		return null;
	}

	/**
	 * @param   {Message} incoming_message
	 * @returns {Message|null}
	 */
	getSentMessageForIncomingMessage(incoming_message) {
		var
			sent_messages = this.getSentMessages(),
			index         = sent_messages.length;

		while (index--) {
			let sent_message = sent_messages[index];

			if (sent_message.matchesIncomingMessage(incoming_message)) {
				remove(sent_message).from(sent_messages);
				return sent_message;
			}
		}

		return null;
	}

	/**
	 * @returns {Message[]}
	 */
	getSentMessages() {
		if (!this.sent_messages) {
			this.sent_messages = [ ];
		}

		return this.sent_messages;
	}

	/**
	 * @param   {Message} sent_message
	 * @returns {void}
	 */
	recordSentMessage(sent_message) {
		var sent_messages = this.getSentMessages();

		add(sent_message).to(sent_messages);
		truncate(sent_messages, HISTORY_LENGTH);
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
			this.emit(Enum_ConnectionEvents.CONNECTION_ERROR, this, error);
		}

		switch (message.getTargetType()) {
			case Enum_TargetTypes.CHANNEL:
				return this.handleChannelModeMessage(message);

			case Enum_TargetTypes.USER:
				return this.handleUserModeMessage(message);

			default:
				throw new Error('Invalid mode message: ' + message.raw_message);
		}
	}

	handleChannelModeMessage(message) {
		var channel = this.getChannelForMessage(message);

		channel.applyModeChanges(message.getModeChanges());
	}

	handleUserModeMessage(message) {
		var user_details = this.getUserDetailsForMessage(message);

		user_details.applyModeChanges(message.getModeChanges());
	}

	handleNickMessage(message) {
		var user_details = this.getUserDetailsForMessage(message);

		user_details.setNickname(message.getNickname());
	}

	handlePartMessage(message) {
		var channel_names = message.getChannelNames();

		if (channel_names.length > 1) {
			throw new Error('invalid channel names in part message');
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
		this.emit(Enum_ConnectionEvents.REGISTRATION_SUCCESS,this);
	}

	handlePasswordMismatchMessage(message) {
		let error = new Error('Invalid password');

		if (!this.isRegistered()) {
			this.emit(Enum_ConnectionEvents.REGISTRATION_FAILURE, this, error);
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
		this.getUserDetails().setUniqueId(message.getUniqueId());
	}

	handleLUserOpMessage(message) {
		var server_details = this.getRemoteServerDetails();

		server_details.setOperatorCount(message.getRemoteOperatorCount());
	}

	handleLUserUnknownMessage(message) {
		var server_details = this.getRemoteServerDetails();

		server_details.setUnknownConnectionCount(
			message.getUnknownConnectionCount()
		);
	}

	handleLUserChannelsMessage(message) {
		var server_details = this.getRemoteServerDetails();

		server_details.setChannelCount(message.getChannelCount());
	}

	handleLocalUsersMessage(message) {
		var server_details = this.getRemoteServerDetails();

		server_details.setUserCount(message.getUserCount());
		server_details.setMaxUserCount(message.getMaxUserCount());
	}

	handleGlobalUsersMessage(message) {
		var server_details = this.getRemoteServerDetails();

		server_details.setGlobalUserCount(message.getUserCount());
		server_details.setMaxGlobalUserCount(message.getMaxUserCount());
	}

	handleAwayMessage(message) {
		var user_details = this.getTargetUserDetailsForMessage(message);

		user_details.setAwayMessage(message.getAwayMessage());

		if (message.hasAwayStartTimestamp()) {
			user_details.setAwayStartTimestamp(message.getAwayStartTimestamp());
		}
	}

	handleUnawayMessage(message) {
		this.getUserDetailsForMessage(message).removeAwayMode();
	}

	handleNowAwayMessage(message) {
		var user_details = this.getUserDetailsForMessage(message);

		user_details.addAwayMode();
		user_details.setAwayStartTimestamp(getCurrentTimestamp());
	}

	handleChannelNoTopicMessage(message) {
		var channel = this.getChannelForMessage(message);

		channel.setTopic(null);
		channel.setTopicAuthorUserId(null);
		channel.setTopicTimestamp(null);
	}

	handleChannelTopicMessage(message) {
		var channel = this.getChannelForMessage(message);

		channel.setTopic(message.getChannelTopic());
	}

	handleChannelTopicDetailsMessage(message) {
		var channel = this.getChannelForMessage(message);

		channel.setTopicAuthorUserId(message.getAuthorUserId());
		channel.setTopicTimestamp(message.getTimestamp());
	}

	handleChannelNamesReplyMessage(message) {
		var channel = this.getChannelForMessage(message);

		channel.addUsersFromNicknames(message.getNames());
	}

	handleChannelEndOfNamesMessage(message) {
		var channel = this.getChannelForMessage(message);

		channel.setJoinIsComplete(true);
	}

	handleChannelUrlMessage(message) {
		var channel = this.getChannelForMessage(message);

		channel.setUrl(message.getUrl());
	}

	handleWhoisUserMessage(message) {
		var user_details = this.getTargetUserDetailsForMessage(message);

		user_details.setNickname(message.getNickname());
		user_details.setHostname(message.getHostname());
		user_details.setUsername(message.getUsername());
		user_details.setRealname(message.getRealname());
	}

	handleWhoisServerMessage(message) {
		var user_details = this.getTargetUserDetailsForMessage(message);

		user_details.setNickname(message.getNickname());
		user_details.setServerHostname(message.getServerHostname());
	}

	handleWhoisHostMessage(message) {
		var user_details = this.getTargetUserDetailsForMessage(message);

		user_details.setNickname(message.getNickname());

		if (message.hasHostname()) {
			user_details.setHostname(message.getHostname());
		}
	}

	handleWhoisModeMessage(message) {
		var user_details = this.getTargetUserDetailsForMessage(message);

		user_details.setNickname(message.getNickname());

		// TODO: set modes
	}

	handleWhoisChannelsMessage(message) {
		var user_details = this.getTargetUserDetailsForMessage(message);

		user_details.setChannelNames(message.getChannelNames());
	}

	handleWhoisSecureMessage(message) {
		var user_details = this.getTargetUserDetailsForMessage(message);

		// NOTICE:
		// There's not really a point in reading the "has_secure_connection"
		// value from the message's user details throwaway object, because
		// a RPL_WHOISSECURE message is only ever received if the user is
		// actually connected securely. So the value would always be "true".
		// But... fuck it.
		user_details.setHasSecureConnection(message.hasSecureConnection());
	}

	handleWhoisIdleMessage(message) {
		var user_details = this.getTargetUserDetailsForMessage(message);

		user_details.setIdleStartTimestamp(message.getIdleStartTimestamp());
		user_details.setSignonTimestamp(message.getSignonTimestamp());
	}

	handleWhoisAccountMessage(message) {
		var user_details = this.getTargetUserDetailsForMessage(message);

		user_details.setAuthname(message.getAuthname());

		// TODO: Ensure that this message is only ever received if the
		// user in question has actually authenticated:
		user_details.setIsAuthenticated(true);
	}

	handleEndOfWhoisMessage(message) {
		var user_details = this.getTargetUserDetailsForMessage(message);

		user_details.handleEndOfWhoisMessage(message);
	}

	handleChannelOperatorPrivilegesNeededMessage(message) {
		var channel_details = this.getChannelForMessage(message);

		channel_details.handleOperatorPrivilegesNeededMessage(message);
	}

	handlePingMessage(ping_message) {
		var
			pong_message = new Message_Command_Pong(),
			hostname     = ping_message.getRemoteServerDetails().getHostname();

		pong_message.getRemoteServerDetails().setHostname(hostname);

		this.sendMessage(pong_message);
	}

	handleTopicMessage(message) {
		var channel = this.getChannelForMessage(message);

		channel.setTopic(message.getChannelTopic());
	}

	handleMotdMessage(message) {
		var server_details = this.getRemoteServerDetails();

		server_details.appendMotdText(message.getText());
	}

	// TODO: Reimplement...
	handleNoSuchNickMessage(message) {
		// Some IRCD's send what *should* be ERR_NOSUCHCHANNEL replies
		// back using this numeric. If that happens, we should transparently
		// create an actual ERR_NOSUCHCHANNEL message and give it the necessary
		// parameters before processing it.
		if (message.hasChannelName()) {
			let new_message = new Message_Reply_NoSuchChannel();

			new_message.setChannelName(message.getChannelName());

			return void this.handleNoSuchChannelMessage(new_message);
		}

		var
			nickname     = message.getNickname(),
			user_details = this.getUserDetailsForNickname(nickname);

		user_details.handleNoSuchNickMessage(message);
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
		var channel = new Client_Channel(channel_name);

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
		var message = new Message_Command_Join();

		message.addChannelName(channel_name);

		if (callback) {
			message.setCallback(callback);
		}

		if (key) {
			message.setChannelKey(channel_name, key);
		}

		this.sendMessage(message);
	}

	leaveChannelName(channel_name, callback) {
		var message = new Message_Command_Part();

		message.addChannelName(channel_name);

		if (callback) {
			message.setCallback(callback);
		}

		this.sendMessage(message);
	}

	setKeyForChannelName(key, channel_name, callback) {
		var message = new Message_Command_Mode();

		message.setChannelName(channel_name);
		message.addMode(Enum_ChannelModes.KEY, [key]);

		if (callback) {
			message.setCallback(callback);
		}

		this.sendMessage(message);
	}

	getRandomChannel() {
		if (this.getChannelCount() === 0) {
			return null;
		}

		return random(this.channels);
	}

	/**
	 * @returns {int}
	 */
	getChannelCount() {
		return this.channels.length;
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
		Message_Command_Private.getMultipleChannelMessages({
			body:         text,
			channel_name: channel_name,
			omit_prefix: true
		}).forEach(this.sendMessage, this);
	}

	sendTextToUser(text, user_details) {
		return this.sendTextToUserByNick(text, user_details.getNickname());
	}

	sendTextToUserByNick(text, nick) {
		Message_Command_Private.getMultipleUserMessages({
			body: text,
			nick: nick,
			omit_prefix: true
		}).forEach(this.sendMessage, this);
	}

	setTopicForChannelName(topic, channel_name, callback) {
		var message = new Message_Command_Topic();

		message.setChannelName(channel_name);
		message.setChannelTopic(topic);

		if (callback) {
			message.setCallback(callback);
		}

		this.sendMessage(message);
	}

	getTopicForChannelName(channel_name, callback) {
		var message = new Message_Command_Topic();

		message.setChannelName(channel_name);

		if (callback) {
			message.setCallback(callback);
		}

		this.sendMessage(message);
	}

	sendWhoisQueryForNick(nick, callback) {
		var
			registry     = this.getUserDetailsRegistry(),
			user_details = registry.getOrStoreUserDetailsForNick(nick);

		if (callback) {
			user_details.addWhoisCallback(callback);
		}

		var message = new Message_Command_Whois();

		message.addTarget(user_details);

		this.sendMessage(message);
	}

	getUserDetailsRegistry() {
		if (!this.user_details_registry) {
			this.user_details_registry = new Client_Registry_UserDetails();
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

	/**
	 * Override the parent class's connect() method in order to supply
	 * the necessary parameters for creating the outgoing socket.
	 *
	 * @param   {function} callback
	 * @returns {void}
	 */
	connect(callback) {
		var
			server_details = this.getRemoteServerDetails(),
			hostname;

		if (server_details.hasHostname()) {
			hostname = server_details.getHostname();
		} else {
			hostname = 'localhost';
		}

		super.connect({
			host: hostname,
			port: server_details.getPort()
		}, callback);
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

	/**
	 * Override the parent class's sendMessage() method in order to assert
	 * that the outgoing message is a valid command message. Also, we need
	 * to record the message as sent so that we can do reconciliation of any
	 * eventual reply from the server.
	 *
	 * @param   {Message} message
	 * @returns {void}
	 */
	sendMessage(message) {
		if (!(message instanceof Message_Command)) {
			throw new Error(`
				Invalid message, expected command
			`);
		}

		message.setOmitPrefix(true);

		super.sendMessage(message);

		this.recordSentMessage(message);
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
			let password_message = new Message_Command_Pass();

			password_message.setPassword(this.getPassword());

			this.sendMessage(password_message);
		}

		var user_details = this.getUserDetails();

		this.sendNickMessage(user_details.getNickname());

		var user_message = (new Message_Command_User())
			.setUsername(user_details.getUsername())
			.setRealname(user_details.getRealname())
			.setModes(user_details.getModes());

		this.sendMessage(user_message);
	}

	changeNickname(nickname, callback) {
		this.sendNickMessage(nickname, callback);
	}

	sendNickMessage(nickname, callback) {
		var message = new Message_Command_Nick();

		message.setNickname(nickname);

		if (callback) {
			message.setCallback(callback);
		}

		this.sendMessage(message);
	}

	handleChannelMessage(message) {
		this.emit('message', this, message);
	}

	getMotd(callback) {
		var server_details = this.getRemoteServerDetails();

		if (server_details.hasMotd()) {
			return void defer(
				callback,
				null,
				server_details.getMotd()
			);
		}

		this.awaitReply(Enum_Replies.RPL_ENDOFMOTD, function handler() {
			return void callback(null, server_details.getMotd());
		});
	}

	awaitReply(reply, callback) {
		if (!has(Enum_Replies, reply)) {
			throw new Error('Invalid reply: ' + reply);
		}

		var handler;

		function handleMessage(self, message) {
			if (message.getReply() === reply) {
				this.removeListener(
					Enum_ConnectionEvents.INCOMING_MESSAGE,
					handler
				);
				callback(message);
			}
		}

		handler = handleMessage.bind(this);

		this.on(Enum_ConnectionEvents.INCOMING_MESSAGE, handler);
	}

	awaitCommand(command, callback) {
		if (!has(Enum_Commands, command)) {
			throw new Error('Invalid command: ' + command);
		}

		var handler;

		function handleMessage(self, message) {
			if (message.getCommand() === command) {
				this.removeListener(
					Enum_ConnectionEvents.INCOMING_MESSAGE,
					handler
				);
				callback(message);
			}
		}

		handler = handleMessage.bind(this);

		this.on(Enum_ConnectionEvents.INCOMING_MESSAGE, handler);
	}

	getOutgoingLogPrefix() {
		var id = this.getId();

		return TextFormatter.cyan(`[C${id}] SEND: `);
	}

	getIncomingLogPrefix() {
		var id = this.getId();

		return TextFormatter.yellow(`[C${id}] RECV: `);
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
		var message = new Message_Command_Oper();

		message.setUsername(username);
		message.setPassword(password);

		if (callback) {
			message.setCallback(callback);
		}

		this.sendMessage(message);
	}

	addUserMode(user_mode, callback) {
		var message = new Message_Command_Mode();

		message.addUserMode(user_mode);
		message.setNickname(this.getNickname());

		if (callback) {
			message.setCallback(callback);
		}

		this.sendMessage(message);
	}

	removeUserMode(user_mode, callback) {
		var message = new Message_Command_Mode();

		message.removeUserMode(user_mode);
		message.setNickname(this.getNickname());

		if (callback) {
			message.setCallback(callback);
		}

		this.sendMessage(message);
	}

	quit(quit_message, callback) {
		var message = new Message_Command_Quit();

		message.setText(quit_message);

		function handler(error) {
			if (error) {
				callback(error);
			}
		}

		if (callback) {
			message.setCallback(handler);
			this.getDisconnectCallbacks().add(callback);
		}

		this.sendMessage(message);
	}

	/**
	 * @param   {string|null} away_message
	 * @param   {function} callback
	 * @returns {void}
	 */
	setAwayMessage(away_message, callback) {
		var message = new Message_Command_Away();

		message.setText(away_message);

		if (callback) {
			message.setCallback(callback);
		}

		this.getUserDetails().setAwayMessage(away_message);
		this.sendMessage(message);
	}

	/**
	 * @returns {string|null}
	 */
	getAwayMessage() {
		return this.getUserDetails().getAwayMessage();
	}

	/**
	 * @returns {boolean}
	 */
	isAway() {
		return this.getUserDetails().isAway();
	}

	/**
	 * @param   {function} callback
	 * @returns {void}
	 */
	sendRestartMessage(callback) {
		var message = new Message_Command_Restart();

		if (callback) {
			message.setCallback(callback);
		}

		this.sendMessage(message);
	}

	/**
	 * @param   {string} hostname
	 * @param   {int} port
	 * @param   {function} callback
	 * @returns {void}
	 */
	sendConnectMessage(hostname, port, callback) {
		var message = new Message_Command_Connect();

		message.setTargetServer(hostname);
		message.setPort(port);

		if (callback) {
			message.setCallback(callback);
		}

		this.sendMessage(message);
	}

}

extend(Client_ServerConnection.prototype, {

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


module.exports = Client_ServerConnection;

