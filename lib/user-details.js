

var
	add    = req('/utilities/add'),
	remove = req('/utilities/remove'),
	extend = req('/utilities/extend'),
	has    = req('/utilities/has');

var
	Regexes             = req('/constants/regexes'),
	ChannelUserPrefixes = req('/constants/channel-user-prefixes'),
	ChannelUserModes    = req('/constants/channel-user-modes'),
	ErrorReasons        = req('/constants/error-reasons'),
	UserModes           = req('/constants/user-modes');

var
	ChannelDetails = req('/lib/channel-details');

var
	NickValidator            = req('/validators/nick'),
	HostnameValidator        = req('/validators/hostname'),
	UsernameValidator        = req('/validators/username'),
	ServerNameValidator      = req('/validators/server-name'),
	RealnameValidator        = req('/validators/realname'),
	UserModeValidator        = req('/validators/user-mode'),
	TimestampValidator       = req('/validators/timestamp'),
	ChannelNameValidator     = req('/validators/channel-name'),
	ChannelUserModeValidator = req('/validators/channel-user-mode');

var
	InvalidUserIdentifierError    = req('/lib/errors/invalid-user-identifier'),
	InvalidChannelUserPrefixError = req('/lib/errors/invalid-channel-user-prefix');



var UNIQUE_IDENTIFIER = 0;


class UserDetails {

	constructor() {
		this.unique_id = UNIQUE_IDENTIFIER++;
	}

	setNick(nick) {
		this.validateNick(nick);
		this.nick = nick;
		return this;
	}

	getNick() {
		this.validateNick(this.nick);
		return this.nick;
	}

	hasNick() {
		return this.nick !== null;
	}

	validateNick(nick) {
		NickValidator.validate(nick);
	}

	getPreregistrationId() {
		return this.preregistration_id;
	}

	hasPreregistrationId() {
		return this.getPreregistrationId() !== null;
	}

	setPreregistrationId(id) {
		this.preregistration_id = id;
	}

	setUsername(username) {
		this.validateUsername(username);
		this.username = username;
		return this;
	}

	getUsername() {
		this.validateUsername(this.username);
		return this.username;
	}

	hasUsername() {
		return this.username !== null;
	}

	validateUsername(username) {
		UsernameValidator.validate(username);
	}

	setHostname(hostname) {
		this.validateHostname(hostname);
		this.hostname = hostname;
		return this;
	}

	getHostname() {
		if (this.hasHiddenHostname()) {
			return this.getHiddenHostname();
		}

		this.validateHostname(this.hostname);
		return this.hostname;
	}

	hasHostname() {
		return this.hostname !== null;
	}

	hasHiddenHostname() {
		return this.getHiddenHostname() !== null;
	}

	getHiddenHostname() {
		return this.hidden_hostname;
	}

	setHiddenHostname(hidden_hostname) {
		this.hidden_hostname = hidden_hostname;
	}

	validateHostname(hostname) {
		HostnameValidator.validate(hostname);
	}

	setServerName(server_name) {
		ServerNameValidator.validate(server_name);
		this.server_name = server_name;
	}

	getServerName() {
		return this.server_name;
	}

	hasServerName() {
		return this.getServerName() !== null;
	}

	setRealname(realname) {
		RealnameValidator.validate(realname);
		this.realname = realname;
		return this;
	}

	getRealname() {
		RealnameValidator.validate(this.realname);
		return this.realname;
	}

	setHasIdent(has_ident) {
		this.has_ident = has_ident;
		return this;
	}

	hasIdent() {
		return this.has_ident;
	}

	getIdentPrefix() {
		if (this.hasIdent()) {
			return '';
		} else {
			return '~';
		}
	}

	setHasSecureConnection(has_secure_connection) {
		this.has_secure_connection = has_secure_connection;
	}

	getHasSecureConnection() {
		return this.has_secure_connection;
	}

	hasSecureConnection() {
		return this.getHasSecureConnection() === true;
	}

	setIsAuthenticated(authenticated) {
		this.authenticated = authenticated;
	}

	isAuthenticated() {
		return this.authenticated;
	}

	getAuthname() {
		return this.authname;
	}

	setAuthname(authname) {
		// TODO: Validation?
		this.authname = authname;
	}

	setSecondsIdle(seconds_idle) {
		this.seconds_idle = seconds_idle;
	}

	getSecondsIdle() {
		return this.seconds_idle;
	}

	setSecondsAway(seconds_away) {
		this.seconds_away = seconds_away;
	}

	getSecondsAway() {
		return this.seconds_away;
	}

	hasSecondsAway() {
		return this.getSecondsAway() !== null;
	}

	setAwayMessage(away_message) {
		this.away_message = away_message;
	}

	getAwayMessage() {
		return this.away_message;
	}

	setSignonTimestamp(timestamp) {
		TimestampValidator.validate(timestamp);
		this.signon_timestamp = timestamp;
	}

	getSignonTimestamp() {
		return this.signon_timestamp;
	}

	getHostmask() {
		return this.getIdentPrefix() + this.getUsername() + '@' + this.getHostname();
	}

	hasHostmask() {
		return this.hasUsername() && this.hasHostname();
	}

	getIdentifier() {
		return this.getNick() + '!' + this.getHostmask();
	}

	hasIdentifier() {
		return this.hasNick() && this.hasHostmask();
	}

	hasMask() {
		// TODO: implement
		return false;
	}

	isOperator() {
		return this.hasMode(UserModes.OPERATOR);
	}

	addMode(mode) {
		UserModeValidator.validate(mode);
		add(mode).to(this.modes);
		return this;
	}

	hasMode(mode) {
		UserModeValidator.validate(mode);

		return has(this.modes, mode);
	}

	getModes() {
		if (!this.modes) {
			this.modes = [ ];
		}

		return this.modes;
	}

	getTargetString() {
		if (this.hasNick()) {
			return this.getNick();
		}

		if (this.hasPreregistrationId()) {
			return this.getPreregistrationId();
		}

		throw new Error(`
			Unable to determine target string for user details
		`);
	}

	matches(user_details) {
		if (this.hasIdentifier() && user_details.hasIdentifier()) {
			return this.getIdentifier() === user_details.getIdentifier();
		}

		if (this.hasNick() && user_details.hasNick()) {
			return this.getNick() === user_details.getNick();
		}

		// TODO: implement wildcard matching

		return false;
	}

	addModes(modes) {
		modes.forEach(this.addMode, this);
	}

	addMode(mode) {
		UserModeValidator.validate(mode);
		add(mode).to(this.getModes());
	}

	removeModes(modes) {
		modes.forEach(this.removeMode, this);
	}

	removeMode(mode) {
		UserModeValidator.validate(mode);
		remove(mode).from(this.getModes());
	}

	getModes() {
		if (!this.modes) {
			this.modes = [ ];
		}

		return this.modes;
	}

	getUniqueId() {
		return this.unique_id;
	}

	getChannelNames() {
		if (!this.channel_names) {
			this.channel_names = [ ];
		}

		return this.channel_names;
	}

	getChannelNamesWithPrefixes() {
		return this.getChannelNames().map(function map(channel_name) {
			var prefix = this.getPrefixForChannelName(channel_name);

			return prefix + channel_name;
		}, this);
	}

	hasChannelNames() {
		return this.getChannelNames().length > 0;
	}

	getPrefixForChannelName(channel_name) {
		if (this.isOperatorForChannelName(channel_name)) {
			return ChannelUserPrefixes.OPERATOR;
		}

		if (this.isVoicedOnChannelName(channel_name)) {
			return ChannelUserPrefixes.VOICED;
		}

		return ChannelUserPrefixes.NONE;
	}

	getPrefixForChannel(channel) {
		return this.getPrefixForChannelName(channel.getName());
	}

	isOperatorForChannelName(channel_name) {
		return this.hasChannelUserModeForChannelName(
			ChannelUserModes.OPERATOR,
			channel_name
		);
	}

	isVoicedOnChannelName(channel_name) {
		return this.hasChannelUserModeForChannelName(
			ChannelUserModes.VOICED,
			channel_name
		);
	}

	setChannelNames(channel_names) {
		this.channel_names = [ ];

		channel_names.forEach(this.addChannelName, this);
	}

	removeChannelName(channel_name) {
		var standardized_name = ChannelDetails.standardizeName(channel_name);

		remove(standardized_name).from(this.getChannelNames());

		this.removeChannelUserModesForChannelName(channel_name);
	}

	addChannelName(channel_name) {
		var user_prefix = channel_name.slice(0, 1);

		if (has(ChannelUserPrefixes, user_prefix)) {
			channel_name = channel_name.slice(1);
		} else {
			user_prefix = null;
		}

		ChannelNameValidator.validate(channel_name);

		var standardized_name = ChannelDetails.standardizeName(channel_name);

		add(standardized_name).to(this.getChannelNames());

		if (user_prefix) {
			this.setUserPrefixForChannelName(user_prefix, channel_name);
		}
	}

	hasChannelName(channel_name) {
		channel_name = ChannelDetails.standardizeName(channel_name);

		var
			index         = 0,
			channel_names = this.getChannelNames();

		while (index < channel_names.length) {
			let current_channel_name = ChannelDetails.standardizeName(
				channel_names[index]
			);

			if (current_channel_name === channel_name) {
				return true;
			}

			index++;
		}

		return false;
	}

	setUserPrefixForChannel(nick_prefix, channel) {
		var channel_name = channel.getName();

		return this.setUserPrefixForChannelName(nick_prefix, channel_name);
	}

	setUserPrefixForChannelName(nick_prefix, channel_name) {
		var channel_user_mode = this.getChannelUserModeForUserPrefix(nick_prefix);

		this.addChannelUserModeForChannelName(
			channel_user_mode,
			channel_name
		);
	}

	addChannelUserModeForChannel(channel_user_mode, channel) {
		return this.addChannelUserModeForChannelName(
			channel_user_mode,
			channel.getName()
		);
	}

	addChannelUserModeForChannelName(channel_user_mode, channel_name) {
		ChannelUserModeValidator.validate(channel_user_mode);

		var channel_user_modes = this.getChannelUserModesForChannelName(
			channel_name
		);

		add(channel_user_mode).to(channel_user_modes);
	}

	removeChannelUserModesForChannelName(channel_name) {
		if (!this.channel_user_modes) {
			return;
		}

		var standardized_name = ChannelDetails.standardizeName(channel_name);

		delete this.channel_user_modes[standardized_name];
	}

	getChannelUserModesForChannelName(channel_name) {
		if (!this.hasChannelName(channel_name)) {
			throw new Error('Not on channel: ' + channel_name);
		}

		if (!this.channel_user_modes) {
			this.channel_user_modes = { };
		}

		channel_name = ChannelDetails.standardizeName(channel_name);

		if (!this.channel_user_modes[channel_name]) {
			this.channel_user_modes[channel_name] = [ ];
		}

		return this.channel_user_modes[channel_name];
	}

	hasChannelUserModeForChannelName(channel_user_mode, channel_name) {
		ChannelUserModeValidator.validate(channel_user_mode);

		var modes = this.getChannelUserModesForChannelName(channel_name);

		return has(modes, channel_user_mode);
	}

	getChannelUserModeForUserPrefix(nick_prefix) {
		switch (nick_prefix) {
			case ChannelUserPrefixes.OWNER:
				return ChannelUserModes.OWNER;

			case ChannelUserPrefixes.ADMIN:
				return ChannelUserModes.ADMIN;

			case ChannelUserPrefixes.OPERATOR:
				return ChannelUserModes.OPERATOR;

			case ChannelUserPrefixes.HALF_OPERATOR:
				return ChannelUserModes.HALF_OPERATOR;

			case ChannelUserPrefixes.VOICED:
				return ChannelUserModes.VOICED;

			default:
				throw new InvalidChannelUserPrefixError(
					nick_prefix,
					ErrorReasons.UNSUPPORTED
				);
		}
	}

	handleNickMessage(message) {
		var user_details = message.getTargetUserDetails();

		this.setNick(user_details.getNick());
	}

	handleModeMessage(message) {
		this.addModes(message.getModesToAdd());
		this.removeModes(message.getModesToRemove());
	}

	handleAwayMessage(message) {
		var user_details = message.getTargetUserDetails();

		this.setAwayMessage(user_details.getAwayMessage());

		if (user_details.hasSecondsAway()) {
			this.setSecondsAway(user_details.getSecondsAway());
		}
	}

	handleWhoisUserMessage(message) {
		var user_details = message.getTargetUserDetails();

		this.setNick(user_details.getNick());
		this.setHostname(user_details.getHostname());
		this.setUsername(user_details.getUsername());
		this.setRealname(user_details.getRealname());
	}

	handleWhoisServerMessage(message) {
		var user_details = message.getTargetUserDetails();

		this.setNick(user_details.getNick());
		this.setServerName(user_details.getServerName());
	}

	handleWhoisHostMessage(message) {
		var user_details = message.getTargetUserDetails();

		this.setNick(user_details.getNick());

		if (user_details.hasHostname()) {
			this.setHostname(user_details.getHostname());
		}
	}

	handleWhoisChannelsMessage(message) {
		this.setChannelNames(message.getChannelNames());
	}

	handleWhoisSecureMessage(message) {
		// NOTICE:
		// There's not really a point in reading the "has_secure_connection"
		// value from the message's user details throwaway object, because
		// a RPL_WHOISSECURE message is only ever received if the user is
		// actually connected securely. So the value would always be "true".
		// But... fuck it.
		var user_details = message.getTargetUserDetails();

		this.setHasSecureConnection(user_details.hasSecureConnection());
	}

	handleWhoisAccountMessage(message) {
		var user_details = message.getTargetUserDetails();

		this.setAuthname(user_details.getAuthname());

		// TODO: Ensure that this message is only ever received if the
		// user in question has actually authenticated:
		this.setIsAuthenticated(true);
	}

	handleWhoisIdleMessage(message) {
		var user_details = message.getTargetUserDetails();

		this.setSecondsIdle(user_details.getSecondsIdle());
		this.setSignonTimestamp(user_details.getSignonTimestamp());
	}

	handleEndOfWhoisMessage(message) {
		this.dispatchWhoisCallbacks(null);
	}

	dispatchWhoisCallbacks(error) {
		var callbacks = this.getWhoisCallbacks();

		while (callbacks.length) {
			callbacks.shift()(error, this);
		}
	}

	addWhoisCallback(callback) {
		add(callback).to(this.getWhoisCallbacks());
	}

	getWhoisCallbacks() {
		if (!this.whois_callbacks) {
			this.whois_callbacks = [ ];
		}

		return this.whois_callbacks;
	}

}

UserDetails.fromIdentifier = function fromIdentifier(client_identifier) {
	var match = client_identifier.match(Regexes.USER_IDENTIFIER);

	if (!match) {
		throw new InvalidUserIdentifierError(client_identifier);
	}

	var
		nick      = match[1],
		username  = match[2],
		hostname  = match[3],
		has_ident = true;

	if (username[0] === '~') {
		has_ident = false;
		username = username.slice(1);
	}

	var user_details = (new UserDetails())
		.setNick(nick)
		.setUsername(username)
		.setHasIdent(has_ident);


	if (Regexes.HOST.test(hostname)) {
		user_details.setHostname(hostname);
	} else {
		user_details.setHiddenHostname(hostname);
	}

	return user_details;
};

UserDetails.fromNick = function fromNick(nick) {
	return (new UserDetails()).setNick(nick);
};

UserDetails.createPreregistrationStub = function createPreregistrationStub() {
	return new UserDetails();
};

extend(UserDetails.prototype, {

	unique_id:             null,
	nick:                  null,
	preregistration_id:    null,
	username:              null,
	hostname:              null,
	server_name:           null,
	hidden_hostname:       null,
	has_ident:             false,
	has_secure_connection: false,
	seconds_idle:          null,
	seconds_away:          null,
	away_message:          null,
	signon_timestamp:      null,

	authenticated:         false,
	authname:              null,

	modes:                 null,

	channel_names:         null,
	channel_user_modes:    null,
	whois_callbacks:       null

});

module.exports = UserDetails;
