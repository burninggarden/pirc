
var
	has            = req('/lib/utilities/has'),
	extend         = req('/lib/utilities/extend'),
	CommandMessage = req('/lib/messages/command'),
	Commands       = req('/lib/constants/commands'),
	UserModes      = req('/lib/constants/user-modes'),
	ErrorReasons   = req('/lib/constants/error-reasons');

var
	UserModesValidator = req('/lib/validators/user-modes');

var
	InvalidUserParametersError = req('/lib/errors/invalid-user-parameters');


class UserMessage extends CommandMessage {

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

		if (has(modes, UserModes.WALLOPS)) {
			bitmask[1] = '1';
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

		if (bitmask_in_binary[1] === '1') {
			modes.push(UserModes.WALLOPS);
		}

		return modes;
	}

	getValuesForParameters() {
		return {
			mode_bitmask: this.getModeBitmask()
		};
	}

	setValuesFromParameters(parameters) {
		this.setModeBitmask(parameters.get('mode_bitmask'));
	}

	serializeParameters() {
		var bitmask = this.getBitmaskFromUserModes(this.modes);

		return `${this.username} ${bitmask} * :${this.realname}`;
	}

	applyParsedParameters(middle_parameters, trailing_parameter) {
		if (middle_parameters.length < 2) {
			throw new InvalidUserParametersError(
				this.getRawMessage(),
				ErrorReasons.NOT_ENOUGH_PARAMETERS
			);
		}

		this.setUsername(middle_parameters[0]);
		this.setModesFromBitmask(middle_parameters[1]);
		this.setRealname(trailing_parameter);
	}

}

extend(UserMessage.prototype, {
	command:  Commands.USER,
	username: null,
	realname: null,
	modes:    null
});

module.exports = UserMessage;
