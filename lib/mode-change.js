
var
	has    = req('/lib/utility/has'),
	extend = req('/lib/utility/extend'),
	add    = req('/lib/utility/add');

var
	Enum_ModeActions        = req('/lib/enum/mode-actions'),
	Enum_ChannelUserModes   = req('/lib/enum/channel-user-modes'),
	Enum_TargetTypes        = req('/lib/enum/target-types'),
	Enum_ModeParameterTypes = req('/lib/enum/mode-parameter-types');

var
	ChannelModeValidator     = req('/lib/validator/channel-mode'),
	ChannelUserModeValidator = req('/lib/validator/channel-user-mode'),
	UserModeValidator        = req('/lib/validator/user-mode');

var
	ChannelEnum_ModeParameterTypes     = req('/lib/enum/channel-mode-parameter-types'),
	UserEnum_ModeParameterTypes        = req('/lib/enum/user-mode-parameter-types'),
	ChannelUserEnum_ModeParameterTypes = req('/lib/enum/channel-user-mode-parameter-types');


class ModeChange {

	setAction(action) {
		if (!has(Enum_ModeActions, action)) {
			throw new Error('Invalid mode action: ' + action);
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
		this.target_type = Enum_TargetTypes.USER;
		return this;
	}

	hasNickname() {
		return this.getNickname() !== null;
	}

	getChannelName() {
		return this.channel_name;
	}

	setChannelName(channel_name) {
		this.channel_name = channel_name;
		this.target_type = Enum_TargetTypes.CHANNEL;
		return this;
	}

	hasChannelName() {
		return this.getChannelName() !== null;
	}

	getTargetType() {
		return this.target_type;
	}

	setTargetType(target_type) {
		if (!has(Enum_TargetTypes, target_type)) {
			throw new Error('Invalid target type: ' + target_type);
		}

		this.target_type = target_type;

		return this;
	}

	validate() {
		var
			mode        = this.getMode(),
			target_type = this.getTargetType();

		switch (target_type) {
			case Enum_TargetTypes.CHANNEL:
				this.validateChannelMode(mode);
				break;

			case Enum_TargetTypes.USER:
				this.validateUserMode(mode);
				break;
		}

		this.validateParameters();
	}

	validateParameters() {
		var type = this.getParameterType();

		switch (type) {
			case Enum_ModeParameterTypes.None:
				return this.validateParameterTypeNone();

			case Enum_ModeParameterTypes.SINGULAR:
				return this.validateParameterTypeSingular();

			case Enum_ModeParameterTypes.PLURAL:
				return this.validateParameterTypePlural();
		}
	}

	validateParameterTypeNone() {
		if (this.hasParameters()) {
			throw new Error(
				'Too many parameters for mode: ' + this.getMode()
			);
		}
	}

	validateParameterTypeSingular() {
		var
			parameters = this.getParameters(),
			mode       = this.getMode();

		if (this.isRemovalAction()) {
			if (parameters.length > 0) {
				throw new Error(
					'Too many parameters for mode: ' + mode
				);
			}

			return;
		}

		if (parameters.length === 0) {
			throw new Error(
				'Not enough parameters for mode: ' + mode
			);
		}

		if (parameters.length > 1) {
			throw new Error(
				'Too many parameters for mode: ' + mode
			);
		}
	}

	validateParameterTypePlural() {
		if (this.isRemovalAction()) {
			return;
		}

		var parameters = this.getParameters();

		if (parameters.length === 0) {
			throw new Error(
				'Not enough parameters for mode: ' + this.getMode()
			);
		}
	}

	validateChannelMode(mode) {
		if (has(Enum_ChannelUserModes, mode)) {
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
			case Enum_TargetTypes.CHANNEL:
				parameter_type = this.getChannelModeParameterType();
				break;

			case Enum_TargetTypes.USER:
				parameter_type = this.getUserModeParameterType();
				break;

			default:
				throw new Error('Invalid target type: ' + target_type);
		}

		if (
			   parameter_type === Enum_ModeParameterTypes.SINGULAR
			&& this.getAction() === Enum_ModeActions.REMOVE
		) {
			parameter_type = Enum_ModeParameterTypes.NONE;
		}

		return parameter_type;
	}

	getChannelModeParameterType() {
		var mode = this.getMode();

		if (has(Enum_ChannelUserModes, mode)) {
			return this.getChannelUserModeParameterType();
		}

		return ChannelEnum_ModeParameterTypes[mode];
	}

	getChannelUserModeParameterType() {
		return ChannelUserEnum_ModeParameterTypes[this.getMode()];
	}

	getUserModeParameterType() {
		return UserEnum_ModeParameterTypes[this.getMode()];
	}

	isRemovalAction() {
		return this.getAction() === Enum_ModeActions.REMOVE;
	}

	isAdditionAction() {
		return this.getAction() === Enum_ModeActions.ADD;
	}

	setMode(mode) {
		var target_type = this.getTargetType();

		switch (target_type) {
			case Enum_TargetTypes.CHANNEL:
				this.validateChannelMode(mode);
				break;

			case Enum_TargetTypes.USER:
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

	action:       Enum_ModeActions.ADD,
	channel_name: null,
	nickname:     null,
	parameters:   null,
	mode:         null,
	target_type:  null

});

module.exports = ModeChange;
