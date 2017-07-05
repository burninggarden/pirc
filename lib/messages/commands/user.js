
var
	has            = req('/lib/utilities/has'),
	extend         = req('/lib/utilities/extend'),
	CommandMessage = req('/lib/messages/command'),
	Commands       = req('/lib/constants/commands'),
	UserModes      = req('/lib/constants/user-modes');


class UserMessage extends CommandMessage {

	setUsername(username) {
		this.username = username;
		return this;
	}

	getUsername() {
		return this.username;
	}

	setRealname(realname) {
		this.realname = realname;
		return this;
	}

	getRealname() {
		return this.realname;
	}

	setModes(modes) {
		this.modes = modes;
		return this;
	}

	getModes() {
		if (!this.modes) {
			this.modes = [ ];
		}

		return this.modes;
	}

	getModeBitmask() {
		var modes = this.getModes();

		var bitmask = '0000';

		if (has(modes, UserModes.INVISIBLE)) {
			bitmask[0] = '1';
		}

		if (has(modes, UserModes.WALLOPS)) {
			bitmask[1] = '1';
		}

		return parseInt(bitmask, 2);
	}

	setModeBitmask(bitmask) {
		var modes = [ ];

		if (isNaN(+bitmask)) {
			// Unfortunately a lot of clients don't send the proper
			// parameter for this slot. We should just ignore it, if so.
			// TODO: maybe logging
			return;
		}

		var bitmask_in_binary = bitmask.toString(2);

		if (bitmask_in_binary[0] === '1') {
			modes.push(UserModes.INVISIBLE);
		}

		if (bitmask_in_binary[1] === '1') {
			modes.push(UserModes.WALLOPS);
		}

		this.setModes(modes);
	}

	getValuesForParameters() {
		var results = {
			username:     this.getUsername(),
			realname:     this.getRealname(),
			mode_bitmask: this.getModeBitmask()
		};

		results.mode_bitmask = 1;

		return results;
	}

	setValuesFromParameters(parameters) {
		this.setUsername(parameters.get('username'));
		this.setRealname(parameters.get('realname'));
		this.setModeBitmask(parameters.get('mode_bitmask'));
	}

}

extend(UserMessage.prototype, {
	command:  Commands.USER,
	abnf:     '<username> " " <mode-bitmask> " * " <realname>',
	username: null,
	realname: null,
	modes:    null
});

module.exports = UserMessage;
