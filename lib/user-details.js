
var
	add                 = require('./utility/add'),
	remove              = require('./utility/remove'),
	extend              = require('./utility/extend'),
	has                 = require('./utility/has'),
	getCurrentTimestamp = require('./utility/get-current-timestamp');

var
	Enum_ChannelUserPrefixes   = require('./enum/channel-user-prefixes'),
	Enum_ChannelEnum_UserModes = require('./enum/channel-user-modes'),
	Enum_UserModes             = require('./enum/user-modes'),
	Enum_ModeActions           = require('./enum/mode-actions'),

	ChannelDetails             = require('./channel-details'),
	Parser_UserId              = require('./parser/user-id');

var
	Validator_Nickname        = require('./validator/nickname'),
	Validator_Hostname        = require('./validator/hostname'),
	Validator_Username        = require('./validator/username'),
	Validator_Realname        = require('./validator/realname'),
	Validator_UserMode        = require('./validator/user-mode'),
	Validator_Timestamp       = require('./validator/timestamp'),
	Validator_ChannelName     = require('./validator/channel-name'),
	Validator_ChannelUserMode = require('./validator/channel-user-mode');


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
		Validator_Nickname.validate(nickname);
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
		Validator_Username.validate(username);
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
		Validator_Hostname.validate(hostname);
	}

	setServerHostname(hostname) {
		Validator_Hostname.validate(hostname);
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
		Validator_Realname.validate(realname);
		this.realname = realname;
		return this;
	}

	getRealname() {
		Validator_Realname.validate(this.realname);
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

	getAuthname() {
		return this.authname;
	}

	setAuthname(authname) {
		// TODO: Validation?
		this.authname = authname;
	}

	setIdleStartTimestamp(timestamp) {
		Validator_Timestamp.validate(timestamp);
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
		Validator_Timestamp.validate(timestamp);
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

	/**
	 * @param   {string|null} away_message
	 * @returns {self}
	 */
	setAwayMessage(away_message) {
		this.away_message = away_message;
		return this;
	}

	/**
	 * @returns {string|null}
	 */
	getAwayMessage() {
		return this.away_message;
	}

	/**
	 * @returns {boolean}
	 */
	hasAwayMessage() {
		return this.getAwayMessage() !== null;
	}

	setSignonTimestamp(timestamp) {
		Validator_Timestamp.validate(timestamp);
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
			match           = Parser_UserId.parse(user_id),
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
		return this.hasMode(Enum_UserModes.OPERATOR);
	}

	isAway() {
		return this.hasMode(Enum_UserModes.AWAY);
	}

	isRestricted() {
		return this.hasMode(Enum_UserModes.RESTRICTED);
	}

	addMode(mode) {
		Validator_UserMode.validate(mode);
		add(mode).to(this.modes);
		return this;
	}

	hasMode(mode) {
		Validator_UserMode.validate(mode);

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
		Validator_UserMode.validate(mode);
		add(mode).to(this.getModes());
	}

	addAwaymode() {
		return this.addMode(Enum_UserModes.AWAY);
	}

	removeModes(modes) {
		modes.forEach(this.removeMode, this);
	}

	removeAwayMode() {
		return this.removeMode(Enum_UserModes.AWAY);
	}

	removeMode(mode) {
		Validator_UserMode.validate(mode);
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
			return Enum_ChannelUserPrefixes.OPERATOR;
		}

		if (this.isVoicedOnChannelName(channel_name)) {
			return Enum_ChannelUserPrefixes.VOICED;
		}

		return Enum_ChannelUserPrefixes.NONE;
	}

	getPrefixForChannel(channel) {
		return this.getPrefixForChannelName(channel.getName());
	}

	isOperatorForChannel(channel) {
		return this.isOperatorForChannelName(channel.getName());
	}

	isOperatorForChannelName(channel_name) {
		return this.hasChannelUserModeForChannelName(
			Enum_ChannelEnum_UserModes.OPERATOR,
			channel_name
		);
	}

	setIsOperatorForChannelName(channel_name, is_operator) {
		if (is_operator) {
			this.addChannelUserModeForChannelName(
				Enum_ChannelEnum_UserModes.OPERATOR,
				channel_name
			);
		} else {
			this.removeChannelUserModeForChannelName(
				Enum_ChannelEnum_UserModes.OPERATOR,
				channel_name
			);
		}
	}

	isVoicedOnChannelName(channel_name) {
		return this.hasChannelUserModeForChannelName(
			Enum_ChannelEnum_UserModes.VOICED,
			channel_name
		);
	}

	setChannelNames(channel_names) {
		this.channel_names = [ ];

		channel_names.forEach(this.addChannelName, this);
	}

	removeChannelName(channel_name) {
		var standardized_name = ChannelDetails.standardizeName(channel_name);

		this.removeEnum_ChannelEnum_UserModesForChannelName(channel_name);

		remove(standardized_name).from(this.getChannelNames());
	}

	addChannelName(channel_name) {
		var user_prefix = channel_name.slice(0, 1);

		if (has(Enum_ChannelUserPrefixes, user_prefix)) {
			channel_name = channel_name.slice(1);
		} else {
			user_prefix = null;
		}

		Validator_ChannelName.validate(channel_name);

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

		Validator_ChannelUserMode.validate(channel_user_mode);

		var channel_user_modes = this.getEnum_ChannelEnum_UserModesForChannelName(
			channel_name
		);

		add(channel_user_mode).to(channel_user_modes);
	}

	removeEnum_ChannelEnum_UserModesForChannelName(channel_name) {
		if (!this.channel_user_modes) {
			return;
		}

		if (!this.hasChannelName(channel_name)) {
			return;
		}

		var standardized_name = ChannelDetails.standardizeName(channel_name);

		delete this.channel_user_modes[standardized_name];
	}

	getEnum_ChannelEnum_UserModesForChannelName(channel_name) {
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
		Validator_ChannelUserMode.validate(channel_user_mode);

		var modes = this.getEnum_ChannelEnum_UserModesForChannelName(channel_name);

		return has(modes, channel_user_mode);
	}

	getChannelUserModeForUserPrefix(nick_prefix) {
		switch (nick_prefix) {
			case Enum_ChannelUserPrefixes.OWNER:
				return Enum_ChannelEnum_UserModes.OWNER;

			case Enum_ChannelUserPrefixes.ADMIN:
				return Enum_ChannelEnum_UserModes.ADMIN;

			case Enum_ChannelUserPrefixes.OPERATOR:
				return Enum_ChannelEnum_UserModes.OPERATOR;

			case Enum_ChannelUserPrefixes.HALF_OPERATOR:
				return Enum_ChannelEnum_UserModes.HALF_OPERATOR;

			case Enum_ChannelUserPrefixes.VOICED:
				return Enum_ChannelEnum_UserModes.VOICED;

			default:
				throw new Error('Invalid channel user prefix: ' + nick_prefix);
		}
	}

	applyModeChanges(mode_changes) {
		mode_changes.forEach(this.applyModeChange, this);
	}

	applyModeChange(mode_change) {
		var action = mode_change.getAction();

		switch (action) {
			case Enum_ModeActions.ADD:
				return this.applyAdditionModeChange(mode_change);

			case Enum_ModeActions.REMOVE:
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

		this.addMode(mode);

		this.addParametersForMode(mode_change.getParameters(), mode);

		return true;
	}

	addMode(mode) {
		add(mode).to(this.getModes());
	}

	/**
	 * @param   {object} mode_change
	 * @returns {boolean} signal indicating whether this mode change should
	 *                    be broadcast to clients
	 */
	applyRemovalModeChange(mode_change) {
		var mode = mode_change.getMode();

		this.removeMode(mode);

		if (mode_change.hasParameters()) {
			this.removeParametersForMode(mode_change.getParameters(), mode);
		} else {
			this.removeAllParametersForMode(mode);
		}

		return true;
	}

	removeMode(mode) {
		remove(mode).from(this.getModes());
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
		parsed_user_id = Parser_UserId.parse(user_id);
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
	channel_user_modes:    null

});

module.exports = UserDetails;
