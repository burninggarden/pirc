
var
	has    = req('/utilities/has'),
	extend = req('/utilities/extend'),
	add    = req('/utilities/add');

var
	InvalidModeActionError   = req('/lib/errors/invalid-mode-action'),
	InvalidTargetError       = req('/lib/errors/invalid-target'),
	ModeActions              = req('/constants/mode-actions'),
	ChannelModeValidator     = req('/validators/channel-mode'),
	UserModeValidator        = req('/validators/user-mode'),
	ChannelUserModeValidator = req('/validators/channel-user-mode'),
	ChannelDetails           = req('/lib/channel-details'),
	UserDetails              = req('/lib/user-details'),
	ErrorReasons             = req('/constants/error-reasons'),
	ModeParameterTypes       = req('/constants/mode-parameter-types');


class ModeChange {

	setAction(action) {
		if (!has(ModeActions, action)) {
			throw new InvalidModeActionError(action);
		}

		this.action = action;
	}

	getAction() {
		return this.action;
	}

	setTarget(target) {
		this.validateTarget(target);
		this.target = target;
	}

	validateTarget(target) {
		if (
			   !(target instanceof UserDetails)
			&& !(target instanceof ChannelDetails)
		) {
			throw new InvalidTargetError(target, ErrorReasons.WRONG_TYPE);
		}
	}

	validate() {
		this.validateTarget();

		var mode = this.getMode();

		if (this.hasChannelTarget()) {
			return this.validateChannelMode(mode);
		}

		if (this.hasUserTarget()) {
			return this.validateUserMode(mode);
		}

		this.validateParameters();
	}

	validateParameters() {
		var type = this.getParameterType();

		switch (type) {
			case ModeParameterTypes.TOGGLE:
				return this.validateToggleParameterType();

			case ModeParameterTypes.SINGULAR:
				return this.validateSingularParameterType();

			case ModeParameterTypes.PLURAL:
				return this.validatePluralParameterType();
		}
	}

	validateToggleParameterType() {
		if (this.hasParameters()) {
			throw new InvalidModeParametersError(
				this.getParameters(),
				ErrorReasons.TOO_MANY_PARAMETERS
			);
		}
	}

	validateSingularParameterType() {
		var parameters = this.getParameters();

		if (this.isRemovalAction()) {
			if (parameters.length > 0) {
				throw new InvalidModeParametersError(
					parameters,
					ErrorReasons.TOO_MANY_PARAMETERS
				);
			}

			return;
		}

		if (parameters.length === 0) {
			throw new InvalidModeParametersError(
				parameters,
				ErrorReasons.NOT_ENOUGH_PARAMETERS
			);
		}

		if (parameters.length > 1) {
			throw new InvalidModeParametersError(
				parameters,
				ErrorReasons.TOO_MANY_PARAMETERS
			);
		}
	}

	validatePluralParameterType() {
		if (this.isRemovalAction()) {
			return;
		}

		var parameters = this.getParameters();

		if (parameters.length === 0) {
			throw new InvalidModeParametersError(
				parameters,
				ErrorReasons.NOT_ENOUGH_PARAMETERS
			);
		}
	}

	validateChannelMode(mode) {
		if (has(ChannelUserModes, mode)) {
			ChannelUserModeValidator.validate(mode);
		} else {
			ChannelModeValidator.validate(mode);
		}
	}

	validateUserMode(mode) {
		UserModeValidator.validate(mode);
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
			this.validateChannelMode(mode);
		} else if (this.hasUserTarget()) {
			this.validateUserMode(mode);
		} else {
			throw new Error('Add a target before setting mode on mode change');
		}

		this.mode = mode;
	}

	getMode() {
		return this.mode;
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
