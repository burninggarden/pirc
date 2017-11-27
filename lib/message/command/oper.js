
/**
 * From RFC2812:
 *
 * ##########################################################################
 *
 * 3.1.4 Oper message
 *
 *       Command: OPER
 *    Parameters: <name> <password>
 *
 *    A normal user uses the OPER command to obtain operator privileges.
 *    The combination of <name> and <password> are REQUIRED to gain
 *    Operator privileges.  Upon success, the user will receive a MODE
 *    message (see section 3.1.5) indicating the new user modes.
 *
 *    Numeric Replies:
 *
 *            ERR_NEEDMOREPARAMS              RPL_YOUREOPER
 *            ERR_NOOPERHOST                  ERR_PASSWDMISMATCH
 *
 *    Example:
 *
 *    OPER foo bar                    ; Attempt to register as an operator
 *                                    using a username of "foo" and "bar"
 *                                    as the password.
 *
 * ##########################################################################
 */


var
	Heket = require('heket');

var
	extend          = require('../../utility/extend'),
	Message_Command = require('../../message/command'),
	Enum_Commands   = require('../../enum/commands'),
	Enum_Replies    = require('../../enum/replies');

var
	Message_Reply_NeedMoreParameters = require('../../message/reply/need-more-parameters');


class Message_Command_Oper extends Message_Command {

	setUsername(username) {
		this.username = username;
		return this;
	}

	getUsername() {
		return this.username;
	}

	setPassword(password) {
		this.password = password;
		return this;
	}

	getPassword() {
		return this.password;
	}

	getValuesForParameters() {
		return {
			username: this.getUsername(),
			password: this.getPassword()
		};
	}

	setValuesFromParameters(parameters) {
		this.setUsername(parameters.get('username'));
		this.setPassword(parameters.get('password'));
	}

	handleParameterParsingError(error) {
		if (
			   error instanceof Heket.MissingRuleValueError
			|| error instanceof Heket.InputTooShortError
		) {
			let message = new Message_Reply_NeedMoreParameters();

			message.setAttemptedCommand(Enum_Commands.OPER);

			this.setImmediateResponse(message);
		}
	}

	getPossibleReplies() {
		return [
			Enum_Replies.ERR_NEEDMOREPARAMS,
			Enum_Replies.RPL_YOUREOPER,
			Enum_Replies.ERR_NOOPERHOST,
			Enum_Replies.ERR_PASSWDMISMATCH
		];
	}

}

extend(Message_Command_Oper.prototype, {
	command: Enum_Commands.OPER,
	abnf:    '<username> " " <password>'
});

module.exports = Message_Command_Oper;
