
var
	has    = req('/utilities/has'),
	extend = req('/utilities/extend'),
	add    = req('/utilities/add');

var
	InvalidModeActionError = req('/lib/errors/invalid-mode-change'),
	ModeActions            = req('/constants/mode-actions'),
	ChannelModeValidator   = req('/validators/channel-mode'),
	UserModeValidator      = req('/validators/user-mode'),
	ChannelDetails         = req('/lib/channel-details'),
	UserDetails            = req('/lib/user-details');


class ModeChange {

	setAction(action) {
		if (!has(ModeActions, action)) {
			throw new InvalidModeActionError(action);
		}

		this.action = action;
	}

	setTarget(target) {
		this.target = target;
	}

	getTarget() {
		return this.target;
	}

	hasTarget() {
		return this.getTarget() !== null;
	}

	hasChannelTarget() {
		return this.getTarget() instanceof ChannelDetails;
	}

	hasUserTarget() {
		return this.getTarget() instanceof UserDetails;
	}

	setMode(mode) {
		if (this.hasChannelTarget()) {
			ChannelModeValidator.validate(mode);
		} else if (this.hasUserTarget()) {
			UserModeValidator.validate(mode);
		} else {
			throw new Error('Add a target before setting mode on mode change');
		}

		this.mode = mode;
	}

	addParameter(parameter) {
		add(parameter).to(this.getParameters());
	}

	getParameters() {
		if (!this.parameters) {
			this.parameters = [ ];
		}

		return this.parameters;
	}

	serializeTokens() {
		return this.action + this.mode;
	}

	serializeParameters() {
		return this.getParameters().join(' ');
	}

}

extend(ModeChange.prototype, {

	action:     ModeActions.ADD,
	target:     null,
	parameters: null

});

module.exports = ModeChange;
