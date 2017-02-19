

var
	extend     = req('/utilities/extend'),
	add        = req('/utilities/add'),
	has        = req('/utilities/has'),
	isFunction = req('/utilities/is-function');

var
	HostnameValidator    = req('/validators/hostname'),
	PortValidator        = req('/validators/port'),
	ServerNameValidator  = req('/validators/server-name'),
	UserModeValidator    = req('/validators/user-mode'),
	ChannelModeValidator = req('/validators/channel-mode'),
	TimestampValidator   = req('/validators/timestamp'),
	UserModes            = req('/constants/user-modes'),
	ChannelModes         = req('/constants/channel-modes'),
	ServerSettings       = req('/lib/server/settings');

var
	InvalidCallbackError = req('/lib/errors/invalid-callback'),
	NoServerMotdError    = req('/lib/errors/no-server-motd');


class ServerDetails {

	constructor() {
		var timestamp = Math.floor(Date.now() / 1000);

		this.setCreatedTimestamp(timestamp);
	}

	setHostname(hostname) {
		HostnameValidator.validate(hostname);
		this.hostname = hostname;
		return this;
	}

	getHostname() {
		HostnameValidator.validate(this.hostname);
		return this.hostname;
	}

	getIdentifier() {
		return this.getHostname();
	}

	setPort(port) {
		this.validatePort(port);

		this.port = port;
	}

	getPort() {
		this.validatePort(this.port);

		return this.port;
	}

	validatePort(port) {
		PortValidator.validate(port);
	}

	setName(name) {
		ServerNameValidator.validate(name);
		this.name = name;
		return this;
	}

	getName(name) {
		ServerNameValidator.validate(this.name);
		return this.name;
	}

	getTargetString() {
		return this.getHostname();
	}

	setChannelModesFromString(channel_modes_string) {
		var tokens = channel_modes_string.split('');

		tokens.forEach(function each(token) {
			if (has(ChannelModes, token)) {
				this.addChannelMode(token);
			}
		}, this);
	}

	setChannelModes(channel_modes) {
		channel_modes.forEach(this.addChannelMode, this);
	}

	addChannelMode(channel_mode) {
		ChannelModeValidator.validate(channel_mode);
		add(channel_mode).to(this.getChannelModes());
	}

	getChannelModes() {
		if (!this.channel_modes) {
			this.channel_modes = [ ];
		}

		return this.channel_modes;
	}

	getChannelModesAsString() {
		return this.getChannelModes().join('');
	}

	setUserModesFromString(user_modes_string) {
		var tokens = user_modes_string.split('');

		tokens.forEach(function each(token) {
			if (has(UserModes, token)) {
				this.addUserMode(token);
			}
		}, this);
	}

	setUserModes(user_modes) {
		user_modes.forEach(this.addUserMode, this);
	}

	addUserMode(user_mode) {
		UserModeValidator.validate(user_mode);
		add(user_mode).to(this.getUserModes());
	}

	getUserModes() {
		if (!this.user_modes) {
			this.user_modes = [ ];
		}

		return this.user_modes;
	}

	getUserModesAsString() {
		return this.getUserModes().join('');
	}

	setVersion(version) {
		this.version = version;
	}

	getVersion() {
		if (this.version === null) {
			let manifest = req('/package.json');

			this.version = manifest.name + '-' + manifest.version;
		}

		return this.version;
	}

	setCreatedTimestamp(timestamp) {
		TimestampValidator.validate(timestamp);
		this.created_timestamp = timestamp;
	}

	getCreatedTimestamp() {
		return this.created_timestamp;
	}

	getMotd() {
		return this.motd;
	}

	hasMotd() {
		return this.getMotd() !== null;
	}

	setMotd(motd) {
		this.motd = motd;
	}

	handleMotdStartMessage(message) {
		this.setMotd('');
	}

	handleMotdMessage(message) {
		this.motd += message.getText() + '\n';
	}

	handleEndOfMotdMessage(message) {
		this.motd_received = true;

		this.dispatchMotdCallbacks(null, this.getMotd());
	}

	handleNoMotdMessage(message) {
		var error = new NoServerMotdError(message.getBody());

		this.setMotdError(error);
	}

	setMotdError(motd_error) {
		this.motd_error = motd_error;
		this.motd_received = true;
		this.motd = null;

		this.dispatchMotdCallbacks(motd_error, null);
	}

	hasReceivedMotd() {
		return this.motd_received;
	}

	dispatchMotdCallbacks(error, motd) {
		var callbacks = this.getMotdCallbacks();

		while (callbacks.length) {
			callbacks.shift()(error, motd);
		}
	}

	getMotdCallbacks() {
		if (!this.motd_callbacks) {
			this.motd_callbacks = [ ];
		}

		return this.motd_callbacks;
	}

	addMotdCallback(callback) {
		if (!isFunction(callback)) {
			throw new InvalidCallbackError();
		}

		add(callback).to(this.getMotdCallbacks());
	}

	getMotdError() {
		return this.motd_error;
	}

	handleLUserOpMessage(message) {
		this.setOperatorCount(message.getOperatorCount());
	}

	setOperatorCount(operator_count) {
		this.operator_count = operator_count;
	}

	getOperatorCount() {
		return this.operator_count;
	}

	handleLUserUnknownMessage(message) {
		this.setUnknownUserCount(message.getUnknownUserCount());
	}

	setUnknownUserCount(unknown_user_count) {
		this.unknown_user_count = unknown_user_count;
	}

	getUnknownUserCount() {
		return this.unknown_user_count;
	}

	handleLUserChannelsMessage(message) {
		this.setChannelCount(message.getChannelCount());
	}

	setChannelCount(channel_count) {
		this.channel_count = channel_count;
	}

	getChannelCount() {
		return this.channel_count;
	}

	setClientCount(client_count) {
		this.client_count = client_count;
	}

	getClientCount() {
		return this.client_count;
	}

	handleLocalUsersMessage(message) {
		this.setCurrentLocalUserCount(message.getCurrentLocalUserCount());
		this.setMaxLocalUserCount(message.getMaxLocalUserCount());
	}

	setCurrentLocalUserCount(user_count) {
		this.current_local_user_count = user_count;
	}

	getCurrentLocalUserCount() {
		return this.current_local_user_count;
	}

	setMaxLocalUserCount(user_count) {
		this.max_local_user_count = user_count;
	}

	getMaxLocalUserCount() {
		return this.max_local_user_count;
	}

	handleGlobalUsersMessage(message) {
		this.setCurrentGlobalUserCount(message.getCurrentGlobalUserCount());
		this.setMaxGlobalUserCount(message.getMaxGlobalUserCount());
	}

	setCurrentGlobalUserCount(user_count) {
		this.current_global_user_count = user_count;
	}

	getCurrentGlobalUserCount() {
		return this.current_global_user_count;
	}

	setMaxGlobalUserCount(user_count) {
		this.max_global_user_count = user_count;
	}

	getMaxGlobalUserCount() {
		return this.max_global_user_count;
	}

	getGlobalVisibleUserCount() {
		return this.global_visible_user_count;
	}

	getGlobalInvisibleUserCount() {
		return this.global_invisible_user_count;
	}

	getMaxLocalConnectionCount() {
		return this.max_local_connection_count;
	}

	getTotalGlobalConnectionCount() {
		return this.total_global_connection_count;
	}

	handleISupportMessage(message) {
		var settings_string = message.getSettingsString();

		this.getSettings().deserialize(settings_string);
	}

	serializeSettings() {
		return this.getSettings().serialize();
	}

	getSettings() {
		if (!this.settings) {
			this.settings = new ServerSettings();
		}

		return this.settings;
	}

}

ServerDetails.fromIdentifier = function fromIdentifier(identifier) {
	var server_details = new ServerDetails();

	server_details.setHostname(identifier);

	return server_details;
};

extend(ServerDetails.prototype, {

	hostname:                      null,
	port:                          null,
	name:                          null,
	version:                       null,

	user_modes:                    null,
	channel_modes:                 null,

	created_timestamp:             null,

	motd:                          null,
	motd_callbacks:                null,
	motd_received:                 false,
	motd_error:                    null,

	operator_count:                0,
	unknown_user_count:            0,
	channel_count:                 0,
	client_count:                  0,
	current_local_user_count:      0,
	max_local_user_count:          0,
	current_global_user_count:     0,
	global_visible_user_count:     0,
	global_invisible_user_count:   0,
	max_global_user_count:         0,
	max_local_connection_count:    0,
	total_global_connection_count: 0,

	settings:                      null

});

module.exports = ServerDetails;
