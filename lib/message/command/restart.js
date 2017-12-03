
/**
 * From RFC2812:
 *
 * ##########################################################################
 *
 * 4.4 Restart message
 *
 *       Command: RESTART
 *    Parameters: None
 *
 *    An operator can use the restart command to force the server to
 *    restart itself.  This message is optional since it may be viewed as a
 *    risk to allow arbitrary people to connect to a server as an operator
 *    and execute this command, causing (at least) a disruption to service.
 *
 *    The RESTART command MUST always be fully processed by the server to
 *    which the sending client is connected and MUST NOT be passed onto
 *    other connected servers.
 *
 *    Numeric Replies:
 *
 *            ERR_NOPRIVILEGES
 *
 *    Example:
 *
 *    RESTART                         ; no parameters required.
 *
 * ##########################################################################
 */

var
	extend          = require('../../utility/extend'),
	Message_Command = require('../command'),
	Enum_Commands   = require('../../enum/commands'),
	Enum_Replies    = require('../../enum/replies');


class Message_Command_Restart extends Message_Command {

	/**
	 * @returns {boolean}
	 */
	hasParameters() {
		return false;
	}

	getPossibleReplies() {
		return [
			Enum_Replies.ERR_NOPRIVILEGES
		];
	}

	matchesIncomingCommandMessage(message) {
		if (message.getCommand() === Enum_Commands.NOTICE) {
			if (message.getMessageBody() === 'Server restarting.') {
				return true;
			}
		}

		return super.matchesIncomingCommandMessage(message);
	}

}

extend(Message_Command_Restart.prototype, {
	command: Enum_Commands.RESTART
});

module.exports = Message_Command_Restart;
