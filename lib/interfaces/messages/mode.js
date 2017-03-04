
var
	extend = req('/utilities/extend'),
	has    = req('/utilities/has'),
	add    = req('/utilities/add');

var
	Commands    = req('/constants/commands'),
	ModeActions = req('/constants/mode-actions'),
	ModeChange  = req('/lib/mode-change');


class ModeMessageInterface {

	serializeParams() {
		var
			targets    = this.serializeTargets(),
			tokens     = this.serializeModeTokens(),
			parameters = this.serializeModeParameters();

		return `${targets} ${tokens} ${parameters}`;
	}

	serializeModeTokens() {
		return this.getModeChanges().map(function map(mode_change) {
			return mode_change.serializeTokens();
		}).join('');
	}

	serializeModeParameters() {
		return this.getModeChanges().map(function map(mode_change) {
			return mode_change.serializeParameters();
		}).join('');
	}

	applyParsedParams(middle_params, trailing_param) {
		this.addTargetFromString(middle_params.shift());

		if (trailing_param) {
			// Some IRCDs specify the modes being added in the body of the
			// message, instead of in the formal parameter list. If that's
			// the case, standardize the parameters by adding the body to
			// the formal list.
			middle_params.push(trailing_param);
		}

		var
			mode_string  = middle_params.shift(),
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

			if (middle_params.length) {
				mode_change.addParameter(middle_params.shift());
			}

			mode_changes.push(mode_change);
		}

		// Apply any remaining parameters to the last mode change:
		while (mode_change && middle_params.length) {
			mode_change.addParameter(middle_params.shift());
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

extend(ModeMessageInterface.prototype, {
	command:      Commands.MODE,
	mode_changes: null
});

module.exports = ModeMessageInterface;
