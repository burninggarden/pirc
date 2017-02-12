

var
	add    = req('/utilities/add'),
	remove = req('/utilities/remove'),
	extend = req('/utilities/extend'),
	has    = req('/utilities/has');

var
	Regexes             = req('/constants/regexes'),
	ChannelUserPrefixes = req('/constants/channel-user-prefixes'),
	ChannelUserModes    = req('/constants/channel-user-modes'),
	ErrorReasons        = req('/constants/error-reasons');

var
	ChannelDetails = req('/lib/channel-details');

var
	NickValidator            = req('/validators/nick'),
	HostnameValidator        = req('/validators/hostname'),
	UsernameValidator        = req('/validators/username'),
	RealnameValidator        = req('/validators/realname'),
	UserModeValidator        = req('/validators/user-mode'),
	ChannelNameValidator     = req('/validators/channel-name'),
	ChannelUserModeValidator = req('/validators/channel-user-mode');

var
	InvalidUserIdentifierError    = req('/lib/errors/invalid-user-identifier'),
	InvalidChannelUserPrefixError = req('/lib/errors/invalid-channel-user-prefix');



var UNIQUE_IDENTIFIER = 0;


class UserDetails {

	constructor() {
		this.unique_identifier = UNIQUE_IDENTIFIER++;
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

	addMode(mode) {
		this.modes.push(mode);
		return this;
	}

	getModes() {
		if (!this.modes) {
			this.modes = [ ];
		}

		return this.modes;
	}

	getTargetString() {
		return this.getNick();
	}

	matches(user_details) {
		if (this.hasIdentifier() && user_details.hasIdentifier()) {
			return this.getIdentifier() === user_details.getIdentifier();
		}

		if (this.hasNick() && user_details.hasNick()) {
			return this.getNick() === user_details.getNick();
		}

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

	getPrefixForChannelName(channel_name) {
		if (this.isOperatorForChannelName(channel_name)) {
			return ChannelUserPrefixes.OPERATOR;
		}

		if (this.isVoicedOnChannelName(channel_name)) {
			return ChannelUserPrefixes.VOICED;
		}

		return ChannelUserPrefixes.NONE;
	}

	setChannelNames(channel_names) {
		this.channel_names = [ ];

		channel_names.forEach(this.addChannelName, this);
	}

	addChannelName(channel_name) {
		var user_prefix = channel_name.slice(0, 1);

		if (has(ChannelUserPrefixes, user_prefix)) {
			channel_name = channel_name.slice(1);
		} else {
			user_prefix = null;
		}

		ChannelNameValidator.validate(channel_name);
		add(channel_name).to(this.getChannelNames());

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

	handleModeMessage(message) {
		this.addModes(message.getModesToAdd());
		this.removeModes(message.getModesToRemove());
	}

	handleWhoisUserMessage(message) {
		var user_details = message.getUserDetails();

		this.setNick(user_details.getNick());
		this.setHostname(user_details.getHostname());
		this.setUsername(user_details.getUsername());
		this.setRealname(user_details.getRealname());
	}

	handleWhoisChannelsMessage(message) {
		this.setChannelNames(message.getChannelNames());
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

	unique_id:          null,
	nick:               null,
	username:           null,
	hostname:           null,
	hidden_hostname:    null,
	has_ident:          false,

	modes:              null,

	channel_names:      null,
	channel_user_modes: null

});

module.exports = UserDetails;
