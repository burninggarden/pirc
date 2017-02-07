
var
	extend                = req('/utilities/extend'),
	add                   = req('/utilities/add'),
	ServerMessage         = req('/lib/server/message'),
	Commands              = req('/constants/commands'),
	UserModesValidator    = req('/validators/user-modes'),
	ChannelModesValidator = req('/validators/channel-modes'),
	ModeActions           = req('/constants/mode-actions');


class ServerModeMessage extends ServerMessage {

	serializeParams() {
		return this.getChannelDetails().getName();
	}

	applyParsedParams(middle_params, trailing_param) {
		this.addTargetFromString(middle_params.pop());
		this.setModesFromModesString(trailing_param);
	}

	validateModes(modes) {
		if (this.hasChannelTarget()) {
			ChannelModesValidator.validate(modes);
		} else {
			UserModesValidator.validate(modes);
		}
	}

	setModesToAdd(modes_to_add) {
		this.validateModes(modes_to_add);
		this.modes_to_add = modes_to_add;
	}

	getModesToAdd() {
		return this.modes_to_add;
	}

	setModesToRemove(modes_to_remove) {
		this.validateModes(modes_to_remove);
		this.modes_to_remove = modes_to_remove;
	}

	getModesToRemove() {
		return this.modes_to_remove;
	}

	setModesFromModesString(modes_string) {
		var
			index           = 0,
			action          = null,
			modes_to_add    = [ ],
			modes_to_remove = [ ];

		while (index < modes_string.length) {
			let token = modes_string[index];

			index++;

			if (token === ModeActions.ADD || token === ModeActions.REMOVE) {
				action = token.action;
			} else if (action === ModeActions.ADD) {
				add(token).to(modes_to_add);
			} else {
				add(token).to(modes_to_remove);
			}
		}

		this.setModesToAdd(modes_to_add);
		this.setModesToRemove(modes_to_remove);
	}

	serializeParams() {
		throw new Error('implement');
	}

}

extend(ServerModeMessage.prototype, {
	command:         Commands.MODE,

	modes_to_add:    null,
	modes_to_remove: null

});

module.exports = ServerModeMessage;
