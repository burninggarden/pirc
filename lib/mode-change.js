
var
	has    = req('/lib/utilities/has'),
	extend = req('/lib/utilities/extend'),
	add    = req('/lib/utilities/add');

var
	InvalidModeActionError     = req('/lib/errors/invalid-mode-action'),
	InvalidModeParametersError = req('/lib/errors/invalid-mode-parameters');

var
	ModeActions        = req('/lib/constants/mode-actions'),
	ChannelUserModes   = req('/lib/constants/channel-user-modes'),
	ErrorReasons       = req('/lib/constants/error-reasons'),
	TargetTypes        = req('/lib/constants/target-types'),
	ModeParameterTypes = req('/lib/constants/mode-parameter-types');

var
	ChannelModeValidator     = req('/lib/validators/channel-mode'),
	ChannelUserModeValidator = req('/lib/validators/channel-user-mode'),
	UserModeValidator        = req('/lib/validators/user-mode');

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

	getNickname() {
		return this.nickname;
	}

	setNickname(nickname) {
		this.nickname = nickname;
		this.target_type = TargetTypes.USER;
		return this;
	}

	getChannelName() {
		return this.channel_name;
	}

	setChannelName(channel_name) {
		this.channel_name = channel_name;
		this.target_type = TargetTypes.CHANNEL;
		return this;
	}

	getTargetType() {
		return this.target_type;
	}

	validate() {
		var
			mode        = this.getMode(),
			target_type = this.getTargetType();

		switch (target_type) {
			case TargetTypes.CHANNEL:
				this.validateChannelMode(mode);
				break;

			case TargetTypes.USER:
				this.validateUserMode(mode);
				break;
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
				this.getTargetType(),
				this.getParameters(),
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
					this.getTargetType(),
					parameters,
					ErrorReasons.TOO_MANY_PARAMETERS
				);
			}

			return;
		}

		if (parameters.length === 0) {
			throw new InvalidModeParametersError(
				mode,
				this.getTargetType(),
				parameters,
				ErrorReasons.NOT_ENOUGH_PARAMETERS
			);
		}

		if (parameters.length > 1) {
			throw new InvalidModeParametersError(
				mode,
				this.getTargetType(),
				parameters,
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
				this.getMode(),
				this.getTargetType(),
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
		var
			target_type    = this.getTargetType(),
			parameter_type = null;

		switch (target_type) {
			case TargetTypes.CHANNEL:
				parameter_type = this.getChannelModeParameterType();
				break;

			case TargetTypes.USER:
				parameter_type = this.getUserModeParameterType();
				break;

			default:
				throw new Error('Invalid target type: ' + target_type);
		}

		if (
			   parameter_type === ModeParameterTypes.SINGULAR
			&& this.getAction() === ModeActions.REMOVE
		) {
			parameter_type = ModeParameterTypes.NONE;
		}

		return parameter_type;
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

	setMode(mode) {
		var target_type = this.getTargetType();

		switch (target_type) {
			case TargetTypes.CHANNEL:
				this.validateChannelMode(mode);
				break;

			case TargetTypes.USER:
				this.validateUserMode(mode);
				break;

			default:
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

	setParameters(parameters) {
		this.parameters = parameters;
		return this;
	}

	hasParameters() {
		return this.getParameters().length > 0;
	}

	serializeParameters() {
		return this.getParameters().join(' ');
	}

}

extend(ModeChange.prototype, {

	action:       ModeActions.ADD,
	channel_name: null,
	nickname:     null,
	parameters:   null,
	mode:         null

});

module.exports = ModeChange;
