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

var
	InvalidMessageStructureError = req('/lib/errors/invalid-message-structure'),
	InvalidUsernameError         = req('/lib/errors/invalid-username'),
	InvalidRealnameError         = req('/lib/errors/invalid-realname'),
	InvalidUserModesError        = req('/lib/errors/invalid-user-modes');

class ClientUserMessage extends ClientMessage {

	getUsername() {
		return this.username;
	}

	setUsername(username) {
		this.validateUsername(username);
		this.username = username;
		return this;
	}

	validateUsername(username) {
		UsernameValidator.validate(username);
	}

	getRealname() {
		return this.realname;
	}

	setRealname(realname) {
		this.validateRealname(realname);
		this.realname = realname;
		return this;
	}

	validateRealname(realname) {
		RealnameValidator.validate(realname);
	}

	getModes() {
		return this.modes;
	}

	setModes(modes) {
		this.validateModes(modes);
		this.modes = modes;
		return this;
	}

	validateModes(modes) {
		UserModesValidator.validate(modes);
	}

	getBitmaskFromUserModes(modes) {
		var bitmask = '0000';

		if (has(modes, UserModes.INVISIBLE)) {
			bitmask[0] = '1';
		}

		return parseInt(bitmask, 2);
	}

	getUserModesFromBitmask(bitmask) {
		var modes = [ ];

		if (!isNaN(+bitmask)) {
			// Unfortunately a lot of clients don't send the proper
			// parameter for this slot. We should just ignore it, if so.
			// TODO: maybe logging
			return modes;
		}

		var bitmask_in_binary = bitmask.toString(2);

		if (bitmask_in_binary[0] === '1') {
			modes.push(UserModes.INVISIBLE);
		}

		return modes;
	}

	serialize() {
		var bitmask = this.getBitmaskFromUserModes(this.modes);

		return `${this.command} ${this.username} ${bitmask} * :${this.realname}`;
	}

	deserialize() {
		var parts = this.getMessageParts();

		if (parts[0] !== Commands.USER) {
			throw new InvalidMessageStructureError(this.raw_message);
		}

		var username = parts[1];

		try {
			this.setUsername(username);
		} catch (error) {

			if (error instanceof InvalidUsernameError) {
				switch (error.reason) {
					default:
						throw error;
				}

			} else {
				throw error;
			}
		}

		var
			bitmask = parts[2],
			modes   = this.getUserModesFromBitmask(bitmask);

		try {
			this.setModes(modes);
		} catch (error) {
			if (error instanceof InvalidUserModesError) {
				switch (error.reason) {
					default:
						throw error;
				}
			} else {
				throw error;
			}
		}

		// Note: the third part is currently unused;
		// TODO: Warn if they failed to specify the unused signifier.

		var realname = parts[4].slice(1);

		try {
			this.setRealname(realname);
		} catch (error) {
			if (error instanceof InvalidRealnameError) {
				switch (error.reason) {
					default:
						throw error;
				}
			} else {
				throw error;
			}
		}

		return this;
	}

}

extend(ClientUserMessage.prototype, {
	command:  Commands.USER,

	username: null,
	realname: null,
	modes:    null
});

module.exports = ClientUserMessage;
