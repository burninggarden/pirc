
var
	has           = req('/lib/utilities/has'),
	extend        = req('/lib/utilities/extend'),
	ClientMessage = req('/lib/client/message'),
	Commands      = req('/lib/constants/commands'),
	UserModes     = req('/lib/constants/user-modes'),
	ErrorReasons  = req('/lib/constants/error-reasons');

var
	UsernameValidator  = req('/lib/validators/username'),
	RealnameValidator  = req('/lib/validators/realname'),
	UserModesValidator = req('/lib/validators/user-modes');

var
	InvalidUserParametersError = req('/lib/errors/invalid-user-parameters');


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

	setModesFromBitmask(bitmask) {
		var modes = this.getUserModesFromBitmask(bitmask);

		return this.setModes(modes);
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

	serializeParams() {
		var bitmask = this.getBitmaskFromUserModes(this.modes);

		return `${this.username} ${bitmask} * :${this.realname}`;
	}

	applyParsedParams(middle_params, trailing_param) {
		if (middle_params.length < 2) {
			throw new InvalidUserParametersError(
				this.getRawMessage(),
				ErrorReasons.NOT_ENOUGH_PARAMETERS
			);
		}

		this.setUsername(middle_params[0]);
		this.setModesFromBitmask(middle_params[1]);
		this.setRealname(trailing_param);
	}

}

extend(ClientUserMessage.prototype, {
	command:  Commands.USER,
	username: null,
	realname: null,
	modes:    null
});

module.exports = ClientUserMessage;
