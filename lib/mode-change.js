
var
	has    = req('/utilities/has'),
	extend = req('/utilities/extend'),
	add    = req('/utilities/add');

var
	InvalidModeActionError     = req('/lib/errors/invalid-mode-action'),
	InvalidTargetError         = req('/lib/errors/invalid-target'),
	InvalidModeParametersError = req('/lib/errors/invalid-mode-parameters');

var
	ModeActions        = req('/lib/constants/mode-actions'),
	ChannelUserModes   = req('/lib/constants/channel-user-modes'),
	ChannelDetails     = req('/lib/channel-details'),
	UserDetails        = req('/lib/user-details'),
	ErrorReasons       = req('/lib/constants/error-reasons'),
	ModeParameterTypes = req('/lib/constants/mode-parameter-types');

var
	ChannelModeValidator     = req('/validators/channel-mode'),
	ChannelUserModeValidator = req('/validators/channel-user-mode'),
	UserModeValidator        = req('/validators/user-mode');

var
	ChannelModeParameterTypes     = req('/lib/constants/channel-mode-parameter-types'),
	UserModeParameterTypes        = req('/lib/constants/user-mode-parameter-types'),
	ChannelUserModeParameterTypes = req('/lib/constants/channel-user-mode-parameter-types');


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
		this.validateTarget(this.getTarget());

		var mode = this.getMode();

		if (this.hasChannelTarget()) {
			this.validateChannelMode(mode);
		}

		if (this.hasUserTarget()) {
			this.validateUserMode(mode);
		}

		this.validateParameters();
	}

	validateParameters() {
		var type = this.getParameterType();

		switch (type) {
			case ModeParameterTypes.None:
				return this.validateParameterTypeNone();

			case ModeParameterTypes.SINGULAR:
				return this.validateParameterTypeSingular();

			case ModeParameterTypes.PLURAL:
				return this.validateParameterTypePlural();
		}
	}

	validateParameterTypeNone() {
		if (this.hasParameters()) {
			throw new InvalidModeParametersError(
				this.getMode(),
				ErrorReasons.TOO_MANY_PARAMETERS
			);
		}
	}

	validateParameterTypeSingular() {
		var
			parameters = this.getParameters(),
			mode       = this.getMode();

		if (this.isRemovalAction()) {
			if (parameters.length > 0) {
				throw new InvalidModeParametersError(
					mode,
					ErrorReasons.TOO_MANY_PARAMETERS
				);
			}

			return;
		}

		if (parameters.length === 0) {
			throw new InvalidModeParametersError(
				mode,
				ErrorReasons.NOT_ENOUGH_PARAMETERS
			);
		}

		if (parameters.length > 1) {
			throw new InvalidModeParametersError(
				mode,
				ErrorReasons.TOO_MANY_PARAMETERS
			);
		}
	}

	validateParameterTypePlural() {
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

	getParameterType() {
		if (this.hasChannelTarget()) {
			return this.getChannelModeParameterType();
		} else {
			return this.getUserModeParameterType();
		}
	}

	getChannelModeParameterType() {
		var mode = this.getMode();

		if (has(ChannelUserModes, mode)) {
			return this.getChannelUserModeParameterType();
		}

		return ChannelModeParameterTypes[mode];
	}

	getChannelUserModeParameterType() {
		return ChannelUserModeParameterTypes[this.getMode()];
	}

	getUserModeParameterType() {
		return UserModeParameterTypes[this.getMode()];
	}

	isRemovalAction() {
		return this.getAction() === ModeActions.REMOVE;
	}

	isAdditionAction() {
		return this.getAction() === ModeActions.ADD;
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

	hasParameters() {
		return this.getParameters().length > 0;
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
