var req = require('req');

var
	has                = req('/utilities/has'),
	extend             = req('/utilities/extend'),
	ClientMessage      = req('/lib/messages/client'),
	Commands           = req('/constants/commands'),
	UserModes          = req('/constants/user-modes'),
	UsernameValidator  = req('/validators/username'),
	RealnameValidator  = req('/validators/realname'),
	UserModesValidator = req('/validators/user-modes');

class ClientUserMessage extends ClientMessage {

	constructor(username, realname, modes) {
		super();

		this.username = username;
		this.realname = realname;
		this.modes = modes;

		this.validateUsername();
		this.validateRealname();
		this.validateModes();
	}

	validateUsername() {
		UsernameValidator.validate(this.username);
	}

	validateRealname() {
		RealnameValidator.validate(this.realname);
	}

	validateModes() {
		UserModesValidator.validate(this.modes);
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
	command: Commands.USER
});

module.exports = ClientUserMessage;
