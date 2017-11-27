
/**
 * From RFC2812:
 *
 * ##########################################################################
 *
 * 3.1.3 User message
 *
 *       Command: USER
 *    Parameters: <user> <mode> <unused> <realname>
 *
 *    The USER command is used at the beginning of connection to specify
 *    the username, hostname and realname of a new user.
 *
 *    The <mode> parameter should be a numeric, and can be used to
 *    automatically set user modes when registering with the server.  This
 *    parameter is a bitmask, with only 2 bits having any signification: if
 *    the bit 2 is set, the user mode 'w' will be set and if the bit 3 is
 *    set, the user mode 'i' will be set.  (See Section 3.1.5 "User
 *    Modes").
 *
 *    The <realname> may contain space characters.
 *
 *    Numeric Replies:
 *
 *            ERR_NEEDMOREPARAMS              ERR_ALREADYREGISTRED
 *
 *    Example:
 *
 *    USER guest 0 * :Ronnie Reagan   ; User registering themselves with a
 *                                    username of "guest" and real name
 *                                    "Ronnie Reagan".
 *
 *    USER guest 8 * :Ronnie Reagan   ; User registering themselves with a
 *                                    username of "guest" and real name
 *                                    "Ronnie Reagan", and asking to be set
 *                                    invisible.
 *
 * ##########################################################################
 */




var
	Heket = require('heket');

var
	has             = require('../../utility/has'),
	extend          = require('../../utility/extend'),
	Message_Command = require('../command'),
	Enum_Commands   = require('../../enum/commands'),
	Enum_Replies    = require('../../enum/replies'),
	Enum_UserModes  = require('../../enum/user-modes');

var
	Message_Reply_NeedMoreParameters = require('../../message/reply/need-more-parameters');


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

	getPossibleReplies() {
		return [
			Enum_Replies.ERR_NEEDMOREPARAMS,
			Enum_Replies.ERR_ALREADYREGISTRED
		];
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
