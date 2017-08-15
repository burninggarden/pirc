
var
	Heket = require('heket');


var
	extend = req('/lib/utilities/extend'),
	add    = req('/lib/utilities/add');

var
	CommandMessage     = req('/lib/messages/command'),
	Commands           = req('/lib/constants/commands'),
	ModeChange         = req('/lib/mode-change'),
	ModeChangeParser   = req('/lib/parsers/mode-change'),
	TargetTypes        = req('/lib/constants/target-types'),
	ModeActions        = req('/lib/constants/mode-actions'),
	ModeParameterTypes = req('/lib/constants/mode-parameter-types');

var
	InvalidUserModeError = req('/lib/errors/invalid-user-mode');

var
	NeedMoreParametersMessage  = req('/lib/messages/replies/need-more-parameters'),
	UserModeUnknownFlagMessage = req('/lib/messages/replies/user-mode-unknown-flag');




class ModeMessage extends CommandMessage {

	addUserMode(user_mode) {
		return this.addUserModes([user_mode]);
	}

	removeUserMode(user_mode) {
		return this.removeUserModes([user_mode]);
	}

	addUserModes(user_modes) {
		this.setTargetType(TargetTypes.USER);
		return this.addModes(user_modes);
	}

	removeUserModes(user_modes) {
		this.setTargetType(TargetTypes.USER);
		return this.removeModes(user_modes);
	}

	addChannelMode(channel_mode) {
		return this.addChannelModes([channel_mode]);
	}

	removeChannelMode(channel_mode) {
		return this.removeChannelModes([channel_mode]);
	}

	addChannelModes(channel_modes) {
		this.setTargetType(TargetTypes.CHANNEL);
		return this.addModes(channel_modes);
	}

	removeChannelModes(channel_modes) {
		this.setTargetType(TargetTypes.CHANNEL);
		return this.removeModes(channel_modes);
	}

	addModes(modes) {
		modes.forEach(this.addMode, this);
		return this;
	}

	removeModes(modes) {
		modes.forEach(this.removeMode, this);
		return this;
	}

	addMode(mode, parameters) {
		var mode_change = new ModeChange();

		mode_change.setTargetType(this.getTargetType());
		mode_change.setMode(mode);
		mode_change.setAction(ModeActions.ADD);

		if (parameters) {
			mode_change.setParameters(parameters);
		}

		return this.addModeChange(mode_change);
	}

	removeMode(mode) {
		var mode_change = new ModeChange();

		mode_change.setTargetType(this.getTargetType());
		mode_change.setMode(mode);
		mode_change.setAction(ModeActions.REMOVE);

		return this.addModeChange(mode_change);
	}

	getChannelName() {
		return this.channel_name;
	}

	hasChannelName() {
		return this.getChannelName() !== null;
	}

	setChannelName(channel_name = null) {
		if (channel_name) {
			this.setTargetType(TargetTypes.CHANNEL);
		}

		this.channel_name = channel_name;
		return this;
	}

	getNickname() {
		return this.nickname;
	}

	hasNickname() {
		return this.getNickname() !== null;
	}

	setNickname(nickname = null) {
		if (nickname) {
			this.setTargetType(TargetTypes.USER);
		}

		this.nickname = nickname;
		return this;
	}

	getValuesForParameters() {
		return {
			channel_name: this.getChannelName(),
			nickname:     this.getNickname(),
			mode_change:  this.getModeChangeValuesForParameters(),
			// TODO: this
			mode_query:   null
		};
	}

	getModeChangeValuesForParameters() {
		var
			addition_changes   = this.getAdditionChanges(),
			removal_changes    = this.getRemovalChanges(),
			mode_change_values = [ ];

		if (addition_changes.length) {
			mode_change_values.push(
				this.getParameterValueForModeChangeSubset(addition_changes)
			);
		}

		if (removal_changes.length) {
			mode_change_values.push(
				this.getParameterValueForModeChangeSubset(removal_changes)
			);
		}

		return mode_change_values;

	}

	getParameterValueForModeChangeSubset(mode_changes) {
		var
			mode_action     = null,
			mode_chars      = [ ],
			mode_parameters = [ ];

		mode_changes.forEach(function each(mode_change) {
			mode_action = mode_change.getAction();
			mode_chars.push(mode_change.getMode());

			if (mode_change.hasParameters()) {
				mode_parameters = mode_parameters.concat(
					mode_change.getParameters()
				);
			}
		});

		return {
			mode_action: mode_action,
			mode_char:   mode_chars,
			mode_param:  mode_parameters
		};
	}

	getAdditionChanges() {
		return this.getModeChanges().filter(function filter(mode_change) {
			return mode_change.isAdditionAction();
		});
	}

	getRemovalChanges() {
		return this.getModeChanges().filter(function filter(mode_change) {
			return mode_change.isRemovalAction();
		});
	}

	setValuesFromParameters(parameters) {
		var
			nickname     = parameters.get('nickname'),
			channel_name = parameters.get('channel_name');

		if (nickname) {
			this.setNickname(nickname);
			this.setTargetType(TargetTypes.USER);
		} else if (channel_name) {
			this.setChannelName(channel_name);
			this.setTargetType(TargetTypes.CHANNEL);
		}

		try {
			this.addModeChangesFromStrings(parameters.getAll('mode_change'));
		} catch (error) {
			if (!(error instanceof InvalidUserModeError)) {
				throw error;
			}

			return this.handleParameterParsingError(error);
		}
	}

	addModeChangesFromStrings(mode_change_strings) {
		mode_change_strings.forEach(this.addModeChangeFromString, this);
	}

	addModeChangeFromString(mode_change_string) {
		var
			match       = ModeChangeParser.parse(mode_change_string),
			mode_action = match.get('mode_action'),
			mode_chars  = match.getAll('mode_char'),
			mode_params = match.getAll('mode_param'),
			target_type = this.getTargetType(),
			index       = 0;

		while (index < mode_chars.length) {
			let
				mode_change = new ModeChange(),
				mode_char   = mode_chars[index];

			switch (target_type) {
				case TargetTypes.CHANNEL:
					mode_change.setChannelName(this.getChannelName());
					break;

				case TargetTypes.USER:
					mode_change.setNickname(this.getNickname());
					break;

				default:
					throw new Error('Invalid target type: ' + target_type);
			}

			mode_change.setMode(mode_char);
			mode_change.setAction(mode_action);

			let
				parameter_type = mode_change.getParameterType(),
				mode_parameter = mode_params[0];

			if (parameter_type !== ModeParameterTypes.NONE && mode_parameter) {
				mode_change.addParameter(mode_parameter);
				mode_params.shift();
			}

			this.addModeChange(mode_change);

			index++;
		}

		while (mode_params.length) {
			this.getLastModeChange().addParameter(mode_params.shift());
		}

	}

	setModeChanges(mode_changes) {
		this.mode_changes = [ ];

		mode_changes.forEach(this.addModeChange, this);

		return this;
	}

	getModeChanges() {
		if (!this.mode_changes) {
			this.mode_changes = [ ];
		}

		return this.mode_changes;
	}

	hasModeChanges() {
		return this.getModeChanges().length > 0;
	}

	getLastModeChange() {
		var mode_changes = this.getModeChanges();

		return mode_changes[mode_changes.length - 1];
	}

	setTargetFromModeChange(mode_change) {
		var target_type = this.getTargetType();

		if (!mode_change.hasNickname() && !mode_change.hasChannelName()) {
			return;
		}

		switch (target_type) {
			case TargetTypes.USER:
				return this.setNickname(mode_change.getNickname());
			case TargetTypes.CHANNEL:
				return this.setChannelName(mode_change.getChannelName());
			default:
				throw new Error('Invalid target type: ' + target_type);
		}
	}

	validateModeChange(mode_change) {
		var target_type = this.getTargetType();

		if (target_type !== mode_change.getTargetType()) {
			let actual_type = mode_change.getTargetType();

			throw new Error(`
				Mode change type mismatch;
				got ${actual_type}, expected ${target_type}
			`);
		}

		mode_change.validate();
	}

	addModeChange(mode_change) {
		this.validateModeChange(mode_change);
		this.setTargetFromModeChange(mode_change);

		add(mode_change).to(this.getModeChanges());

		return this;
	}

	validate() {
		this.getModeChanges().forEach(this.validateModeChange, this);
	}

	getTargetType() {
		return this.target_type;
	}

	setTargetType(target_type) {
		this.target_type = target_type;
		return this;
	}

	handleParameterParsingError(error) {
		if (
			   error instanceof Heket.InputTooShortError
			|| error instanceof Heket.NoMatchingAlternativeError
		) {
			let message = new NeedMoreParametersMessage();

			message.setAttemptedCommand(Commands.MODE);

			return this.setImmediateResponse(message);
		}

		if (error instanceof InvalidUserModeError) {
			let message = new UserModeUnknownFlagMessage();

			return this.setImmediateResponse(message);
		}
	}

}


extend(ModeMessage.prototype, {
	command:      Commands.MODE,
	abnf:         '( <channel-name> / <nickname> ) ( *<mode-change> / *<mode-query> )',
	mode_changes: null,
	channel_name: null,
	nickname:     null
});

module.exports = ModeMessage;
