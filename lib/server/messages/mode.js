
var
	extend = req('/utilities/extend'),
	has    = req('/utilities/has');

var
	ServerMessage = req('/lib/server/message'),
	Commands      = req('/constants/commands'),
	ModeActions   = req('/constants/mode-actions'),
	ModeChange    = req('/lib/mode-change');


class ServerModeMessage extends ServerMessage {

	serializeParams() {
		if (this.hasChannelTarget()) {
			this.serializeChannelParams();
		} else if (this.hasUserTarget()) {
			this.serializeUserParams();
		} else {
			throw new Error('wtf');
		}
	}

	serializeChannelParams() {
	}

	serializeUserParams() {
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
				mode_change.setParameter(middle_params.shift());
			}

			mode_changes.push(mode_change);
		}

		this.setModeActions(mode_changes);
	}

	setModeActions(mode_actions) {
		this.mode_actions = mode_actions;
	}

}

extend(ServerModeMessage.prototype, {
	command:      Commands.MODE,
	mode_actions: null
});

module.exports = ServerModeMessage;
