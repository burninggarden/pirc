


var
	has    = req('/utilities/has'),
	add    = req('/utilities/add'),
	remove = req('/utilities/remove'),
	extend = req('/utilities/extend');

var
	ChannelNameValidator = req('/validators/channel-name'),
	ChannelModeValidator = req('/validators/channel-mode');

var
	ChannelModes = req('/constants/channel-modes');


class ChannelDetails {

	setName(name) {
		ChannelNameValidator.validate(name);
		this.name = name;
		return this;
	}

	getName() {
		ChannelNameValidator.validate(this.name);
		return this.name;
	}

	getStandardizedName() {
		return ChannelDetails.standardizeName(this.getName());
	}

	getTargetString() {
		return this.getName();
	}

	isPublic() {
		return this.is_public;
	}

	setIsPublic(is_public) {
		this.is_public = is_public;
		return this;
	}

	isSecret() {
		return this.is_secret;
	}

	setIsSecret(is_secret) {
		this.is_secret = is_secret;
		return this;
	}

	allowsModes() {
		return this.allows_modes;
	}

	/**
	 * I'd love to find the documentation in the RFC for this stuff.
	 * I had to just copy the logic from ircd-seven...
	 *
	 * @returns {string}
	 */
	getPrivacySignifier() {
		if (this.isPublic()) {
			return '=';
		} else if (this.isSecret()) {
			return '@';
		} else {
			return '*';
		}
	}

	applyPrivacySignifier(signifier) {
		switch (signifier) {
			case '=':
				return this.setIsPublic(true);

			case '@':
				return this.setIsSecret(true);

			default:
				// Noop.
				return;
		}
	}

	handleModeMessage(message) {
		this.addModes(message.getModesToAdd());
		this.removeModes(message.getModesToRemove());
	}

	addModes(modes) {
		modes.forEach(this.addMode, this);
	}

	addMode(mode) {
		ChannelModeValidator.validate(mode);
		add(mode).to(this.getModes());
	}

	removeModes(modes) {
		modes.forEach(this.removeMode, this);
	}

	removeMode(mode) {
		ChannelModeValidator.validate(mode);
		remove(mode).from(this.getModes());
	}

	getModes() {
		if (!this.modes) {
			this.modes = [ ];
		}

		return this.modes;
	}

	hasMode(channel_mode) {
		ChannelModeValidator.validate(channel_mode);
		return has(this.getModes(), channel_mode);
	}

	hasLimit() {
		return this.hasMode(ChannelModes.LIMIT);
	}

	isSecret() {
		return this.hasMode(ChannelModes.SECRET);
	}

	isKeyProtected() {
		return this.hasMode(ChannelModes.KEY);
	}

	isInviteOnly() {
		return this.hasMode(ChannelModes.INVITE_ONLY);
	}

}

ChannelDetails.fromName = function fromName(channel_name) {
	return (new ChannelDetails()).setName(channel_name);
};

ChannelDetails.standardizeName = function standardizeName(channel_name) {
	// TODO: Proper casing for other equivalent characters, ie "[]":
	return channel_name.toLowerCase();
};

extend(ChannelDetails.prototype, {
	name:         null,
	is_public:    true,
	is_secret:    false,
	allows_modes: true
});

module.exports = ChannelDetails;
