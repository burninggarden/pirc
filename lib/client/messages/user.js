var req = require('req');

var
	has                = req('/utilities/has'),
	extend             = req('/utilities/extend'),
	ClientMessage      = req('/lib/client/message'),
	Commands           = req('/constants/commands'),
	UserModes          = req('/constants/user-modes'),
	UsernameValidator  = req('/validators/username'),
	RealnameValidator  = req('/validators/realname'),
	UserModesValidator = req('/validators/user-modes');

class ClientUserMessage extends ClientMessage {

	setUsername(username) {
		this.validateUsername(username);
		this.username = username;
		return this;
	}

	validateUsername(username) {
		UsernameValidator.validate(username);
	}

	setRealname(realname) {
		this.validateRealname(realname);
		this.realname = realname;
		return this;
	}

	validateRealname(realname) {
		RealnameValidator.validate(realname);
	}

	setModes(modes) {
		this.validateModes(modes);
		this.modes = modes;
		return this;
	}

	validateModes(modes) {
		UserModesValidator.validate(modes);
	}

	serialize() {
		var bitmask = '0000';

		if (has(this.modes, UserModes.INVISIBLE)) {
			bitmask[0] = '1';
		}

		bitmask = parseInt(bitmask, 2);

		return `${this.command} ${this.username} ${bitmask} * :${this.realname}`;
	}

}

extend(ClientUserMessage.prototype, {
	command: Commands.USER,

	username: null,
	realname: null,
	modes: null
});

module.exports = ClientUserMessage;
