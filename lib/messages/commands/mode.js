
var
	extend = req('/lib/utilities/extend'),
	add    = req('/lib/utilities/add');

var
	CommandMessage   = req('/lib/messages/command'),
	Commands         = req('/lib/constants/commands'),
	ModeChange       = req('/lib/mode-change'),
	ModeChangeParser = req('/lib/parsers/mode-change');


class ModeMessage extends CommandMessage {

	getChannelName() {
		return this.channel_name;
	}

	hasChannelName() {
		return this.getChannelName() !== null;
	}

	setChannelName(channel_name = null) {
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
		this.setNickname(parameters.get('nickname'));
		this.setChannelName(parameters.get('channel_name'));

		this.addModeChangesFromStrings(parameters.getAll('mode_change'));
	}

	addModeChangesFromStrings(mode_change_strings) {
		mode_change_strings.forEach(this.addModeChangeFromString, this);
	}

	addModeChangeFromString(mode_change_string) {
		var match = ModeChangeParser.parse(mode_change_string);

		var
			mode_action = match.get('mode_action'),
			mode_chars  = match.getAll('mode_char'),
			mode_params = match.getAll('mode_params'),
			index       = 0;

		while (index < mode_chars.length) {
			let
				mode_change    = new ModeChange(),
				mode_char      = mode_chars[index],
				mode_parameter = mode_params.shift();

			if (this.hasChannelName()) {
				mode_change.setChannelName(this.getChannelName());
			}

			if (this.hasNickname()) {
				mode_change.setNickname(this.getNickname());
			}

			mode_change.setMode(mode_char);
			mode_change.setAction(mode_action);

			if (mode_parameter) {
				mode_change.addParameter(mode_parameter);
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

	getLastModeChange() {
		var mode_changes = this.getModeChanges();

		return mode_changes[mode_changes.length - 1];
	}

	setTargetFromModeChange(mode_change) {
		if (mode_change.hasNickname()) {
			this.setNickname(mode_change.getNickname());
		} else {
			this.setChannelName(mode_change.getChannelName());
		}
	}

	validateModeChange(mode_change) {
		if (this.hasNickname() && !mode_change.hasNickname()) {
			throw new Error('Invalid mode change; expected user mode');
		} else if (this.hasChannelName() && !mode_change.hasChannelName()) {
			throw new Error('Invalid mode change; expected channel mode');
		}

		mode_change.validate();
	}

	addModeChange(mode_change) {
		this.validateModeChange(mode_change);
		this.setTargetFromModeChange(mode_change);

		add(mode_change).to(this.getModeChanges());
	}

	validate() {
		this.getModeChanges().forEach(this.validateModeChange, this);
	}

}


extend(ModeMessage.prototype, {
	command:      Commands.MODE,
	abnf:         '( <channel-name> / <nickname> ) ( *<mode-change> / <mode-query> )',
	mode_changes: null,
	channel_name: null,
	nickname:     null
});

module.exports = ModeMessage;
