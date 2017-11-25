

var
	extend              = req('/lib/utility/extend'),
	add                 = req('/lib/utility/add'),
	has                 = req('/lib/utility/has'),
	isFunction          = req('/lib/utility/is-function'),
	getCurrentTimestamp = req('/lib/utility/get-current-timestamp');

var
	Validator_Hostname        = req('/lib/validator/hostname'),
	Validator_Port            = req('/lib/validator/port'),
	Validator_ServerName      = req('/lib/validator/server-name'),
	Validator_UserMode        = req('/lib/validator/user-mode'),
	Validator_ChannelMode     = req('/lib/validator/channel-mode'),
	Validator_ChannelUserMode = req('/lib/validator/channel-user-mode'),
	Validator_Timestamp       = req('/lib/validator/timestamp');

var
	Server_Settings = req('/lib/server/settings');

var
	Enum_UserModes        = req('/lib/enum/user-modes'),
	Enum_ChannelUserModes = req('/lib/enum/channel-user-modes');


class ServerDetails {

	constructor() {
		this.stamp = Math.random().toString(16).slice(3);
		this.setCreatedTimestamp(getCurrentTimestamp());
	}

	setHostname(hostname) {
		Validator_Hostname.validate(hostname);
		this.hostname = hostname;
		return this;
	}

	getHostname() {
		Validator_Hostname.validate(this.hostname);
		return this.hostname;
	}

	hasHostname() {
		return this.hostname !== null;
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
		Validator_Port.validate(port);
	}

	setName(name) {
		Validator_ServerName.validate(name);
		this.name = name;
		return this;
	}

	getName(name) {
		Validator_ServerName.validate(this.name);
		return this.name;
	}

	getTargetString() {
		return this.getHostname();
	}

	setChannelModesFromString(channel_modes_string) {
		var tokens = channel_modes_string.split('');

		tokens.forEach(function each(token) {
			this.addChannelMode(token);
		}, this);
	}

	setChannelModes(channel_modes) {
		channel_modes.forEach(this.addChannelMode, this);
	}

	addChannelMode(channel_mode) {
		if (has(Enum_ChannelUserModes, channel_mode)) {
			return this.addChannelUserMode(channel_mode);
		}

		Validator_ChannelMode.validate(channel_mode);
		add(channel_mode).to(this.getChannelModes());
	}

	getChannelModes() {
		if (!this.channel_modes) {
			this.channel_modes = [ ];
		}

		return this.channel_modes;
	}

	hasChannelMode(mode) {
		return has(this.getChannelModes(), mode);
	}

	getChannelModesAsString() {
		return this.getChannelModes().join('');
	}

	addChannelUserMode(mode) {
		Validator_ChannelUserMode.validate(mode);
		add(mode).to(this.getChannelUserModes());
	}

	hasChannelUserMode(mode) {
		return has(this.getChannelUserModes(), mode);
	}

	getChannelUserModes() {
		if (!this.channel_user_modes) {
			this.channel_user_modes = [ ];
		}

		return this.channel_user_modes;
	}

	getChannelUserModesAsString() {
		return this.getChannelUserModes().join('');
	}

	setUserModesFromString(user_modes_string) {
		var tokens = user_modes_string.split('');

		tokens.forEach(function each(token) {
			if (has(Enum_UserModes, token)) {
				this.addUserMode(token);
			}
		}, this);
	}

	setUserModes(user_modes) {
		user_modes.forEach(this.addUserMode, this);
	}

	addUserMode(user_mode) {
		Validator_UserMode.validate(user_mode);
		add(user_mode).to(this.getUserModes());
	}

	hasUserMode(user_mode) {
		return has(this.getUserModes(), user_mode);
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
		Validator_Timestamp.validate(timestamp);
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
		// TODO: Clean this up
		var error = new Error('No motd');

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
		var callbacks = this.resetMotdCallbacks();

		while (callbacks.length) {
			callbacks.shift()(error, motd);
		}
	}

	getMotdCallbacks() {
		if (!this.motd_callbacks) {
			this.resetMotdCallbacks();
		}

		return this.motd_callbacks;
	}

	resetMotdCallbacks() {
		var prior_callbacks = this.motd_callbacks;

		this.motd_callbacks = [ ];

		return prior_callbacks || [ ];
	}

	addMotdCallback(callback) {
		if (!isFunction(callback)) {
			throw new Error('Invalid callback: ' + callback);
		}

		add(callback).to(this.getMotdCallbacks());
	}

	getMotdError() {
		return this.motd_error;
	}

	handleLUserOpMessage(message) {
		this.setOperatorCount(message.getRemoteOperatorCount());
	}

	setOperatorCount(operator_count) {
		this.operator_count = operator_count;
	}

	getOperatorCount() {
		return this.operator_count;
	}

	hasOperators() {
		return this.getOperatorCount() > 0;
	}

	handleLUserUnknownMessage(message) {
		this.setUnknownConnectionCount(message.getUnknownConnectionCount());
	}

	setUnknownConnectionCount(unknown_connection_count) {
		this.unknown_connection_count = unknown_connection_count;
		return this;
	}

	getUnknownConnectionCount() {
		return this.unknown_connection_count;
	}

	hasUnknownConnections() {
		return this.getUnknownConnectionCount() > 0;
	}

	handleLUserChannelsMessage(message) {
		this.setChannelCount(message.getRemoteChannelCount());
	}

	setChannelCount(channel_count) {
		this.channel_count = channel_count;
		return this;
	}

	getChannelCount() {
		return this.channel_count;
	}

	hasChannels() {
		return this.getChannelCount() > 0;
	}

	incrementChannelCount() {
		this.setChannelCount(this.getChannelCount() + 1);
	}

	decrementChannelCount() {
		this.setChannelCount(this.getChannelCount() - 1);
	}

	setClientCount(client_count) {
		this.client_count = client_count;
	}

	getClientCount() {
		return this.client_count;
	}

	handleLocalUsersMessage(message) {
		this.setUserCount(message.getUserCount());
		this.setMaxUserCount(message.getMaxUserCount());
	}

	setUserCount(user_count) {
		this.user_count = user_count;
	}

	getUserCount() {
		return this.user_count;
	}

	setMaxUserCount(user_count) {
		this.max_user_count = user_count;
	}

	getMaxUserCount() {
		return this.max_user_count;
	}

	getMaxClientCount() {
		return this.max_client_count;
	}

	handleGlobalUsersMessage(message) {
		this.setGlobalUserCount(message.getUserCount());
		this.setMaxGlobalUserCount(message.getMaxUserCount());
	}

	setGlobalUserCount(user_count) {
		this.global_user_count = user_count;
	}

	getGlobalUserCount() {
		return this.global_user_count;
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

	getMaxConnectionCount() {
		return this.max_connection_count;
	}

	getTotalConnectionCount() {
		return this.total_connection_count;
	}

	getGlobalServiceCount() {
		return this.global_service_count;
	}

	getServerCount() {
		return this.server_count;
	}

	handleISupportMessage(message) {
		throw new Error('implement');
	}

	serializeSettings() {
		return this.getSettings().serialize();
	}

	getSettings() {
		if (!this.settings) {
			this.settings = new Server_Settings();
		}

		return this.settings;
	}

	/**
	 * @param   {boolean} should_restart
	 * @returns {self}
	 */
	setShouldRestart(should_restart = true) {
		this.should_restart = should_restart;
		return this;
	}

	/**
	 * @returns {boolean}
	 */
	shouldRestart() {
		return this.should_restart;
	}

}

ServerDetails.fromHostname = function fromHostname(hostname) {
	var server_details = new ServerDetails();

	server_details.setHostname(hostname);

	return server_details;
};

extend(ServerDetails.prototype, {

	hostname:                    null,
	port:                        null,
	name:                        null,
	version:                     null,

	user_modes:                  null,
	channel_modes:               null,
	channel_user_modes:          null,

	created_timestamp:           null,

	motd:                        null,
	motd_callbacks:              null,
	motd_received:               false,
	motd_error:                  null,

	operator_count:              0,
	unknown_connection_count:    0,
	channel_count:               0,
	user_count:                  0,
	service_count:               0,
	client_count:                0,
	server_count:                1,

	max_user_count:              0,
	max_client_count:            0,
	max_connection_count:        0,
	max_global_user_count:       0,

	global_user_count:           0,
	global_service_count:        0,
	global_visible_user_count:   0,
	global_invisible_user_count: 0,

	total_connection_count:      0,

	settings:                    null,

	should_restart:              false

});

module.exports = ServerDetails;
