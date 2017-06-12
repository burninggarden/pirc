
var
	extend = req('/lib/utilities/extend'),
	has    = req('/lib/utilities/has'),
	add    = req('/lib/utilities/add');

var
	CommandMessage = req('/lib/messages/command'),
	Commands       = req('/lib/constants/commands'),
	ModeActions    = req('/lib/constants/mode-actions'),
	ModeChange     = req('/lib/mode-change'),
	ErrorReasons   = req('/lib/constants/error-reasons');

var
	InvalidCommandError     = req('/lib/errors/invalid-command'),
	InvalidChannelNameError = req('/lib/errors/invalid-channel-name');


class ModeMessage extends CommandMessage {

	serializeParameters() {
		var
			targets    = this.serializeTargets(),
			tokens     = this.serializeModeTokens(),
			parameters = this.serializeModeParameters();

		var result = `${targets} ${tokens} ${parameters}`;

		// If there weren't any actual parameters, then the serialized message
		// will have an extra space at the end that should be removed:
		return result.trim();
	}

	serializeModeTokens() {
		var
			addition_changes = this.getAdditionChanges(),
			removal_changes  = this.getRemovalChanges(),
			result           = '';

		if (addition_changes.length) {
			result += ModeActions.ADD;

			addition_changes.forEach(function each(mode_change) {
				result += mode_change.getMode();
			});
		}

		if (removal_changes.length) {
			result += ModeActions.REMOVE;

			removal_changes.forEach(function each(mode_change) {
				result += mode_change.getMode();
			});
		}

		return result;
	}

	serializeModeParameters() {
		var
			addition_parameters = this.serializeAdditionParameters(),
			removal_parameters  = this.serializeRemovalParameters();

		if (!removal_parameters.length) {
			return addition_parameters;
		}

		return addition_parameters + ' ' + removal_parameters;
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

	serializeAdditionParameters() {
		return this.serializeParametersForChanges(this.getAdditionChanges());
	}

	serializeRemovalParameters() {
		return this.serializeParametersForChanges(this.getRemovalChanges());
	}

	serializeParametersForChanges(mode_changes) {
		var result = '';

		mode_changes.forEach(function each(mode_change) {
			if (mode_change.hasParameters()) {
				result += mode_change.serializeParameters() + ' ';
			}
		});

		return result.trim();
	}

	applyParsedParameters(middle_parameters, trailing_parameter) {
		var target = middle_parameters.shift();

		try {
			this.addTargetFromString();
		} catch (error) {
			throw new InvalidChannelNameError(
				target,
				ErrorReasons.INVALID_CHARACTERS
			);
		}

		if (trailing_parameter) {
			// Some IRCDs specify the modes being added in the body of the
			// message, instead of in the formal parameter list. If that's
			// the case, standardize the parameters by adding the body to
			// the formal list.
			middle_parameters.push(trailing_parameter);
		}

		var mode_string  = middle_parameters.shift();

		if (!mode_string) {
			throw new InvalidCommandError(
				Commands.MODE,
				ErrorReasons.NOT_ENOUGH_PARAMETERS
			);
		}

		var
			mode_action  = ModeActions.ADD,
			mode_changes = [ ],
			index        = 0,
			mode_change  = null;

		while (index < mode_string.length) {
			let token = mode_string[index];

			index++;

			if (has(ModeActions, token)) {
				mode_action = token;
				continue;
			}

			mode_change = new ModeChange();

			mode_change.setAction(mode_action);
			mode_change.setTarget(this.getFirstTarget());
			mode_change.setMode(token);

			if (middle_parameters.length) {
				mode_change.addParameter(middle_parameters.shift());
			}

			mode_changes.push(mode_change);
		}

		// Apply any remaining parameters to the last mode change:
		while (mode_change && middle_parameters.length) {
			mode_change.addParameter(middle_parameters.shift());
		}

		this.setModeChanges(mode_changes);
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

		if (!this.hasAnyTarget() && mode_change.hasTarget()) {
			this.addTarget(mode_change.getTarget());
		}
	}

	addMode(mode) {
		var mode_change = new ModeChange();

		mode_change.setAction(ModeActions.ADD);
		mode_change.setMode(mode);

		this.addModeChange(mode_change);
	}

	removeMode(mode) {
		var mode_change = new ModeChange();

		mode_change.setAction(ModeActions.REMOVE);
		mode_change.setMode(mode);

		this.addModeChange(mode_change);
	}

	getChannelNames() {
		return this.getChannelTargetStrings();
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
	mode_changes: null
});

module.exports = ModeMessage;
