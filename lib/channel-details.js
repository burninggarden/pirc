
var
	has    = require('./utility/has'),
	add    = require('./utility/add'),
	remove = require('./utility/remove'),
	extend = require('./utility/extend');

var
	Validator_ChannelName = require('./validator/channel-name'),
	Validator_ChannelMode = require('./validator/channel-mode');

var
	Enum_ChannelModes = require('./enum/channel-modes'),
	Enum_ModeActions  = require('./enum/mode-actions');


class ChannelDetails {

	setName(name) {
		Validator_ChannelName.validate(name);
		this.name = name;
		return this;
	}

	getName() {
		Validator_ChannelName.validate(this.name);
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

	getKey() {
		return this.getSingleParameterForMode(Enum_ChannelModes.KEY);
	}

	setKey(key) {
		return this.addParameterForMode(key, Enum_ChannelModes.KEY);
	}

	hasKey() {
		return this.getKey() !== null;
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
				throw new Error(`Invalid mode action: ${action}`);
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

		return false;
	}

	addParametersForMode(parameters, mode) {
		parameters.forEach(function each(parameter) {
			this.addParameterForMode(parameter, mode);
		}, this);
		return this;
	}

	addParameterForMode(parameter, mode) {
		add(parameter).to(this.getParametersForMode(mode));
		return this;
	}

	removeParametersForMode(parameters, mode) {
		parameters.forEach(function each(parameter) {
			this.removeParameterForMode(parameter, mode);
		}, this);
		return this;
	}

	removeParameterForMode(parameter, mode) {
		remove(parameter).from(this.getParametersForMode(mode));
		return this;
	}

	removeAllParametersForMode(mode) {
		return this.removeParametersForMode(
			this.getParametersForMode(mode),
			mode
		);
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

	getSingleParameterForMode() {
		return this.getParametersForMode()[0];
	}

	getModes() {
		if (!this.modes) {
			this.modes = [ ];
		}

		return this.modes;
	}

	hasMode(channel_mode) {
		Validator_ChannelMode.validate(channel_mode);
		return has(this.getModes(), channel_mode);
	}

	hasLimit() {
		return this.hasMode(Enum_ChannelModes.LIMIT);
	}

	isSecret() {
		return this.hasMode(Enum_ChannelModes.SECRET);
	}

	isKeyProtected() {
		return this.hasMode(Enum_ChannelModes.KEY);
	}

	isInviteOnly() {
		return this.hasMode(Enum_ChannelModes.INVITE_ONLY);
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
	name:               null,
	is_public:          true,
	is_secret:          false,
	key:                null,
	allows_modes:       true,
	mode_parameter_map: null
});

module.exports = ChannelDetails;
