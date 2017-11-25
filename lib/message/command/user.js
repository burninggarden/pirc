
var
	Heket = require('heket');

var
	has             = req('/lib/utility/has'),
	extend          = req('/lib/utility/extend'),
	Message_Command = req('/lib/message/command'),
	Enum_Commands   = req('/lib/enum/commands'),
	Enum_UserModes  = req('/lib/enum/user-modes');

var
	Message_Reply_NeedMoreParameters = req('/lib/message/reply/need-more-parameters');


class Message_Command_User extends Message_Command {

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

		if (has(modes, Enum_UserModes.INVISIBLE)) {
			bitmask[0] = '1';
		}

		if (has(modes, Enum_UserModes.WALLOPS)) {
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
			modes.push(Enum_UserModes.INVISIBLE);
		}

		if (bitmask_in_binary[1] === '1') {
			modes.push(Enum_UserModes.WALLOPS);
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

	handleParameterParsingError(error) {
		if (error instanceof Heket.InputTooShortError) {
			let message = new Message_Reply_NeedMoreParameters();

			message.setAttemptedCommand(Enum_Commands.USER);
			message.setIsLethal();

			return void this.setImmediateResponse(message);
		}
	}

}

extend(Message_Command_User.prototype, {
	command:  Enum_Commands.USER,
	abnf:     '<username> " " <mode-bitmask> " * " <realname>',
	username: null,
	realname: null,
	modes:    null
});

module.exports = Message_Command_User;
