
var
	extend = req('/lib/utilities/extend'),
	add    = req('/lib/utilities/add');

var
	CommandMessage = req('/lib/messages/command'),
	Commands       = req('/lib/constants/commands');


class ModeMessage extends CommandMessage {

	getChannelName() {
		return this.getFirstChannelName();
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

	getParameterValuesForModeChanges() {
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
			mode_chars.push(mode_change.getModeChar());

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
		throw new Error('implement');
	}

	setModeChanges(mode_changes) {
		this.mode_changes = mode_changes;
	}

	getModeChanges() {
		if (!this.mode_changes) {
			this.mode_changes = [ ];
		}

		return this.mode_changes;
	}

	addModeChange(mode_change) {
		add(mode_change).to(this.getModeChanges());
	}

	validate() {
		var mode_changes = this.getModeChanges();

		mode_changes.forEach(function each(mode_change) {
			mode_change.validate();
		});
	}

}


extend(ModeMessage.prototype, {
	command:      Commands.MODE,
	abnf:         '( <channel-name> / <nickname> ) ( *<mode-change> / <mode-query> )',
	mode_changes: null
});

module.exports = ModeMessage;
