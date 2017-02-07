

var
	extend = req('/utilities/extend'),
	add    = req('/utilities/add'),
	has    = req('/utilities/has');

var
	HostnameValidator    = req('/validators/hostname'),
	PortValidator        = req('/validators/port'),
	ServerNameValidator  = req('/validators/server-name'),
	UserModeValidator    = req('/validators/user-mode'),
	ChannelModeValidator = req('/validators/channel-mode'),
	UserModes            = req('/constants/user-modes'),
	ChannelModes         = req('/constants/channel-modes');


class ServerDetails {

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

	setUserModesFromString(user_modes_string) {
		var tokens = user_modes_string.split('');

		tokens.forEach(function each(token) {
			if (has(UserModes, token)) {
				this.addUserMode(token);
			}
		}, this);
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

	setVersion(version) {
		this.version = version;
	}

	getVersion() {
		return this.version;
	}

}

ServerDetails.fromIdentifier = function fromIdentifier(identifier) {
	var server_details = new ServerDetails();

	server_details.setHostname(identifier);

	return server_details;
};

extend(ServerDetails.prototype, {
	hostname:      null,
	port:          null,
	name:          null,
	version:       null,
	user_modes:    null,
	channel_modes: null
});

module.exports = ServerDetails;
