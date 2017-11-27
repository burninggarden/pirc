
/**
 * From RFC2812:
 *
 * ##########################################################################
 *
 * 3.1.1 Password message
 *
 *       Command: PASS
 *    Parameters: <password>
 *
 *    The PASS command is used to set a 'connection password'.  The
 *    optional password can and MUST be set before any attempt to register
 *    the connection is made.  Currently this requires that user send a
 *    PASS command before sending the NICK/USER combination.
 *
 *    Numeric Replies:
 *
 *            ERR_NEEDMOREPARAMS              ERR_ALREADYREGISTRED
 *
 *    Example:
 *
 *            PASS secretpasswordhere
 *
 * ##########################################################################
 */


var
	Heket = require('heket');

var
	extend          = require('../../utility/extend'),
	Message_Command = require('../command'),
	Enum_Commands   = require('../../enum/commands'),
	Enum_Replies    = require('../../enum/replies');

var
	Message_Reply_NeedMoreParameters = require('../../message/reply/need-more-parameters');


class Message_Command_Pass extends Message_Command {

	setPassword(password) {
		this.password = password;
		return this;
	}

	getPassword() {
		return this.password;
	}

	getValuesForParameters() {
		return {
			password: this.getPassword()
		};
	}

	setValuesFromParameters(parameters) {
		this.setPassword(parameters.get('password'));
	}

	handleParameterParsingError(error) {
		if (!(error instanceof Heket.MissingRuleValueError)) {
			return super.handleParameterParsingError(error);
		}

		var message = new Message_Reply_NeedMoreParameters();

		message.setAttemptedCommand(Enum_Commands.PASS);
		message.setIsLethal();

		this.setImmediateResponse(message);
	}

	getPossibleReplies() {
		return [
			Enum_Replies.ERR_NEEDMOREPARAMS,
			Enum_Replies.ERR_ALREADYREGISTRED
		];
	}

}

extend(Message_Command_Pass.prototype, {
	command: Enum_Commands.PASS,
	abnf:    '<password>'
});

module.exports = Message_Command_Pass;
