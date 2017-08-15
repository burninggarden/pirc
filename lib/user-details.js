
var
	add                 = req('/lib/utilities/add'),
	remove              = req('/lib/utilities/remove'),
	extend              = req('/lib/utilities/extend'),
	has                 = req('/lib/utilities/has'),
	getCurrentTimestamp = req('/lib/utilities/get-current-timestamp');

var
	ChannelUserPrefixes = req('/lib/constants/channel-user-prefixes'),
	ChannelUserModes    = req('/lib/constants/channel-user-modes'),
	UserModes           = req('/lib/constants/user-modes'),
	ModeActions         = req('/lib/constants/mode-actions'),
	UserIdParser        = req('/lib/parsers/user-id');

var
	ChannelDetails = req('/lib/channel-details');

var
	NicknameValidator        = req('/lib/validators/nickname'),
	HostnameValidator        = req('/lib/validators/hostname'),
	UsernameValidator        = req('/lib/validators/username'),
	RealnameValidator        = req('/lib/validators/realname'),
	UserModeValidator        = req('/lib/validators/user-mode'),
	TimestampValidator       = req('/lib/validators/timestamp'),
	ChannelNameValidator     = req('/lib/validators/channel-name'),
	ChannelUserModeValidator = req('/lib/validators/channel-user-mode');


var UNIQUE_ID = 0;

const NON_IDENT_PREFIX = '~';


class UserDetails {

	constructor() {
		this.unique_id = UNIQUE_ID++;

		this.idle_start_timestamp = getCurrentTimestamp();
		this.signon_timestamp     = getCurrentTimestamp();
	}

	setNickname(nickname) {
		this.validateNickname(nickname);
		this.nickname = nickname;
		return this;
	}

	getNickname() {
		return this.nickname;
	}

	hasNickname() {
		return this.getNickname() !== null;
	}

	validateNickname(nickname) {
		NicknameValidator.validate(nickname);
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

	getPassword() {
		return this.password;
	}

	setPassword(password) {
		this.password = password;
		return this;
	}

	hasPassword() {
		return this.getPassword() !== null;
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

	setServerHostname(hostname) {
		HostnameValidator.validate(hostname);
		this.server_hostname = hostname;
	}

	getServerHostname() {
		return this.server_hostname;
	}

	hasServerHostname() {
		return this.getServerHostname() !== null;
	}

	isLocatedOnServer(server_details) {
		// TODO: Fix this shit. It is a total cludge...
		return server_details.getHostname() === this.getServerHostname();
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
			return NON_IDENT_PREFIX;
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

	setIsAuthenticated(is_authenticated) {
		this.is_authenticated = is_authenticated;
		return this;
	}

	isAuthenticated() {
		return this.is_authenticated;
	}

	setIsRegistered(is_registered) {
		this.is_registered = is_registered;
		return this;
	}

	isRegistered() {
		return this.is_registered;
	}

	setIsRegistering(is_registering) {
		this.is_registering = is_registering;
		return this;
	}

	isRegistering() {
		return this.is_registering;
	}

	getAuthname() {
		return this.authname;
	}

	setAuthname(authname) {
		// TODO: Validation?
		this.authname = authname;
	}

	setIdleStartTimestamp(timestamp) {
		TimestampValidator.validate(timestamp);
		this.idle_start_timestamp = timestamp;
	}

	bumpIdleStartTimestamp() {
		this.setIdleStartTimestamp(getCurrentTimestamp());
	}

	getIdleStartTimestamp() {
		return this.idle_start_timestamp;
	}

	getSecondsIdle() {
		return getCurrentTimestamp() - this.getIdleStartTimestamp();
	}

	setAwayStartTimestamp(timestamp) {
		TimestampValidator.validate(timestamp);
		this.away_start_timestamp = timestamp;
	}

	getAwayStartTimestamp() {
		return this.away_start_timestamp;
	}

	getSecondsAway() {
		return getCurrentTimestamp() - this.getAwayStartTimestamp();
	}

	hasAwayStartTimestamp() {
		return this.getAwayStartTimestamp() !== null;
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

	getUserId() {
		if (!this.hasUserId()) {
			return null;
		}

		return this.getNickname() + '!' + this.getHostmask();
	}

	setUserId(user_id) {
		var
			match           = UserIdParser.parse(user_id),
			nickname        = match.get('nickname'),
			no_ident_prefix = match.get('no_ident_prefix'),
			username        = match.get('username'),
			hostname        = match.get('hostname');

		if (no_ident_prefix === NON_IDENT_PREFIX) {
			this.setHasIdent(true);
		} else {
			this.setHasIdent(false);
		}

		this.setNickname(nickname);
		this.setUsername(username);
		this.setHostname(hostname);
	}

	hasUserId() {
		return this.hasNickname() && this.hasHostmask();
	}

	hasMask() {
		// TODO: implement
		return false;
	}

	isOperator() {
		return this.hasMode(UserModes.OPERATOR);
	}

	isAway() {
		return this.hasMode(UserModes.AWAY);
	}

	isRestricted() {
		return this.hasMode(UserModes.RESTRICTED);
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
		if (!this.isRegistered()) {
			return '*';
		}

		if (this.hasNickname()) {
			return this.getNickname();
		}

		throw new Error(`
			Unable to determine target string for user details
		`);
	}

	matches(user_details) {
		if (this.hasUserId() && user_details.hasUserId()) {
			return this.getUserId() === user_details.getUserId();
		}

		if (this.hasNickname() && user_details.hasNickname()) {
			return this.getNickname() === user_details.getNickname();
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

	setUniqueId(unique_id) {
		this.unique_id = unique_id;
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

	isOperatorForChannel(channel) {
		return this.isOperatorForChannelName(channel.getName());
	}

	isOperatorForChannelName(channel_name) {
		return this.hasChannelUserModeForChannelName(
			ChannelUserModes.OPERATOR,
			channel_name
		);
	}

	setIsOperatorForChannelName(channel_name, is_operator) {
		if (is_operator) {
			this.addChannelUserModeForChannelName(
				ChannelUserModes.OPERATOR,
				channel_name
			);
		} else {
			this.removeChannelUserModeForChannelName(
				ChannelUserModes.OPERATOR,
				channel_name
			);
		}
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

		this.removeChannelUserModesForChannelName(channel_name);

		remove(standardized_name).from(this.getChannelNames());
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
		if (!this.hasChannelName(channel_name)) {
			throw new Error('Not on channel: ' + channel_name);
		}

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

		if (!this.hasChannelName(channel_name)) {
			return;
		}

		var standardized_name = ChannelDetails.standardizeName(channel_name);

		delete this.channel_user_modes[standardized_name];
	}

	getChannelUserModesForChannelName(channel_name) {
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
				throw new Error('Invalid channel user prefix: ' + nick_prefix);
		}
	}

	handleNickMessage(message) {
		var nickname = message.getNickname();

		this.setNickname(nickname);

		// TODO: Is this the best thing to be returning?
		this.dispatchNickCallbacks(null, nickname);
	}

	handleModeMessage(message) {
		message.getModeChanges().forEach(this.applyModeChange, this);

		this.dispatchModeCallbacks(null);
	}

	applyModeChange(mode_change) {
		var action = mode_change.getAction();

		switch (action) {
			case ModeActions.ADD:
				return this.applyAdditionModeChange(mode_change);

			case ModeActions.REMOVE:
				return this.applyRemovalModeChange(mode_change);

			default:
				throw new Error('Invalid mode action: ' + action);
		}
	}

	/**
	 * @param   {object} mode_change
	 * @returns {boolean} signal indicating whether this mode change should
	 *                    be broadcast to clients
	 */
	applyAdditionModeChange(mode_change) {
		var mode = mode_change.getMode();

		add(mode).to(this.getModes());

		this.addParametersForMode(mode_change.getParameters(), mode);

		return true;
	}

	/**
	 * @param   {object} mode_change
	 * @returns {boolean} signal indicating whether this mode change should
	 *                    be broadcast to clients
	 */
	applyRemovalModeChange(mode_change) {
		var mode = mode_change.getMode();

		remove(mode).from(this.getModes());

		if (mode_change.hasParameters()) {
			this.removeParametersForMode(mode_change.getParameters(), mode);
		} else {
			this.removeAllParametersForMode(mode);
		}

		return true;
	}

	addParametersForMode(parameters, mode) {
		parameters.forEach(function each(parameter) {
			this.addParameterForMode(parameter, mode);
		}, this);
	}

	addParameterForMode(parameter, mode) {
		add(parameter).to(this.getParametersForMode(mode));
	}

	removeParametersForMode(parameters, mode) {
		parameters.forEach(function each(parameter) {
			this.removeParameterForMode(parameter, mode);
		}, this);
	}

	removeParameterForMode(parameter, mode) {
		remove(parameter).from(this.getParametersForMode(mode));
	}

	removeAllParametersForMode(mode) {
		this.removeParametersForMode(this.getParametersForMode(mode), mode);
	}

	getModeParameterMap() {
		if (!this.mode_parameter_map) {
			this.mode_parameter_map = { };
		}

		return this.mode_parameter_map;
	}

	getParametersForMode(mode) {
		var mode_parameter_map = this.getModeParameterMap();

		if (!mode_parameter_map[mode]) {
			mode_parameter_map[mode] = [ ];
		}

		return mode_parameter_map[mode];
	}

	handleAwayMessage(message) {
		var user_details = message.getTargetUserDetails();

		this.setAwayMessage(user_details.getAwayMessage());

		if (user_details.hasAwayStartTimestamp()) {
			this.setAwayStartTimestamp(user_details.getAwayStartTimestamp());
		}
	}

	handleWhoisUserMessage(message) {
		var user_details = message.getTargetUserDetails();

		this.setNickname(user_details.getNickname());
		this.setHostname(user_details.getHostname());
		this.setUsername(user_details.getUsername());
		this.setRealname(user_details.getRealname());
	}

	handleWhoisServerMessage(message) {
		var user_details = message.getTargetUserDetails();

		this.setNickname(user_details.getNickname());
		this.setServerHostname(user_details.getServerHostname());
	}

	handleWhoisHostMessage(message) {
		var user_details = message.getTargetUserDetails();

		this.setNickname(user_details.getNickname());

		if (user_details.hasHostname()) {
			this.setHostname(user_details.getHostname());
		}
	}

	handleWhoisModeMessage(message) {
		var user_details = message.getTargetUserDetails();

		this.setNickname(user_details.getNickname());

		// TODO: set modes
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

		this.setIdleStartTimestamp(user_details.getIdleStartTimestamp());
		this.setSignonTimestamp(user_details.getSignonTimestamp());
	}

	handleNoSuchNickMessage(message) {
		var error = new Error('No such nickname: ' + message.getNickname());

		this.dispatchNickCallbacks(error);
	}

	handleEndOfWhoisMessage(message) {
		this.dispatchWhoisCallbacks(this.getWhoisError());
	}

	handleYourIdMessage(message) {
		var user_details = message.getTargetUserDetails();

		this.setUniqueId(user_details.getUniqueId());
	}

	handleNicknameInUseMessage(message) {
		var error = new Error('Nickname in use: ' + message.getNickname());

		this.dispatchNickCallbacks(error);
	}

	handleNoNicknameGivenMessage(message) {
		var error = new Error('Must supply a nickname');

		this.dispatchNickCallbacks(error);
	}

	handleErroneousNicknameMessage(message) {
		var error = new Error('Erroneous nickname: ' + message.getNickname());

		this.dispatchNickCallbacks(error);
	}

	handleNeedMoreModeParametersMessage(message) {
		var error = new Error('Need more mode parameters');

		this.dispatchModeCallbacks(error);
	}

	handleNeedMoreOperParametersMessage(message) {
		var error = new Error('Need more OPER parameters');

		this.dispatchOperatorCallbacks(error);
	}

	handleYouAreOperatorMessage(message) {
		this.dispatchOperatorCallbacks(null);
	}

	dispatchNickCallbacks(error) {
		var nick_callbacks = this.resetNickCallbacks();

		while (nick_callbacks.length) {
			nick_callbacks.shift()(error);
		}
	}

	dispatchModeCallbacks(error) {
		var mode_callbacks = this.resetModeCallbacks();

		while (mode_callbacks.length) {
			mode_callbacks.shift()(error);
		}
	}

	dispatchWhoisCallbacks(error) {
		var callbacks = this.resetWhoisCallbacks();

		this.clearWhoisError();

		while (callbacks.length) {
			callbacks.shift()(error, this);
		}
	}

	dispatchOperatorCallbacks(error) {
		var callbacks = this.resetOperatorCallbacks();

		while (callbacks.length) {
			callbacks.shift()(error, this);
		}
	}

	addNickCallback(callback) {
		add(callback).to(this.getNickCallbacks());
	}

	getNickCallbacks() {
		if (!this.nick_callbacks) {
			this.resetNickCallbacks();
		}

		return this.nick_callbacks;
	}

	resetNickCallbacks() {
		var prior_callbacks = this.nick_callbacks;

		this.nick_callbacks = [ ];

		return prior_callbacks || [ ];
	}

	addModeCallback(callback) {
		add(callback).to(this.getModeCallbacks());
	}

	getModeCallbacks() {
		if (!this.mode_callbacks) {
			this.resetModeCallbacks();
		}

		return this.mode_callbacks;
	}

	resetModeCallbacks() {
		var prior_callbacks = this.mode_callbacks;

		this.mode_callbacks = [ ];

		return prior_callbacks || [ ];
	}

	getWhoisCallbacks() {
		if (!this.whois_callbacks) {
			this.resetWhoisCallbacks();
		}

		return this.whois_callbacks;
	}

	resetWhoisCallbacks() {
		var prior_callbacks = this.whois_callbacks;

		this.whois_callbacks = [ ];

		return prior_callbacks || [ ];
	}

	addWhoisCallback(callback) {
		add(callback).to(this.getWhoisCallbacks());
	}

	setWhoisError(error) {
		this.whois_error = error;
	}

	getWhoisError() {
		return this.whois_error;
	}

	clearWhoisError() {
		this.setWhoisError(null);
	}

	addOperatorCallback(callback) {
		add(callback).to(this.getOperatorCallbacks());
	}

	getOperatorCallbacks() {
		if (!this.operator_callbacks) {
			this.resetOperatorCallbacks();
		}

		return this.operator_callbacks;
	}

	resetOperatorCallbacks() {
		var prior_callbacks = this.operator_callbacks;

		this.operator_callbacks = [ ];

		return prior_callbacks || [ ];
	}

}

UserDetails.fromNickname = function fromNickname(nickname) {
	return (new UserDetails()).setNickname(nickname);
};

UserDetails.fromUserId = function fromUserId(user_id) {
	if (!user_id) {
		throw new Error('Must supply a user id');
	}

	var parsed_user_id = null;

	try {
		parsed_user_id = UserIdParser.parse(user_id);
	} catch (error) {
		throw error;
	}

	return (new UserDetails())
		.setNickname(parsed_user_id.get('nickname'))
		.setUsername(parsed_user_id.get('username'))
		.setHostname(parsed_user_id.get('hostname'));
};

extend(UserDetails.prototype, {

	unique_id:             null,
	nickname:              null,

	is_registered:         true,
	is_registering:        false,

	username:              null,
	hostname:              null,
	password:              null,
	server_hostname:       null,
	hidden_hostname:       null,
	has_ident:             false,
	has_secure_connection: false,

	idle_start_timestamp:  null,
	away_start_timestamp:  null,

	away_message:          null,
	signon_timestamp:      null,

	is_authenticated:      false,
	authname:              null,

	modes:                 null,
	mode_parameter_map:    null,

	channel_names:         null,
	channel_user_modes:    null,

	whois_callbacks:       null,
	whois_error:           null,

	nick_callbacks:        null,

	operator_callbacks:    null

});

module.exports = UserDetails;
