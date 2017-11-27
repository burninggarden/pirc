/**
 * From RFC2812:
 *
 * ##########################################################################
 *
 * 4.1 Away
 *
 *       Command: AWAY
 *    Parameters: [ <text> ]
 *
 *    With the AWAY command, clients can set an automatic reply string for
 *    any PRIVMSG commands directed at them (not to a channel they are on).
 *    The server sends an automatic reply to the client sending the PRIVMSG
 *    command.  The only replying server is the one to which the sending
 *    client is connected to.
 *
 *    The AWAY command is used either with one parameter, to set an AWAY
 *    message, or with no parameters, to remove the AWAY message.
 *
 *    Because of its high cost (memory and bandwidth wise), the AWAY
 *    message SHOULD only be used for client-server communication.  A
 *    server MAY choose to silently ignore AWAY messages received from
 *    other servers.  To update the away status of a client across servers,
 *    the user mode 'a' SHOULD be used instead.  (See Section 3.1.5)
 *
 *    Numeric Replies:
 *
 *            RPL_UNAWAY                    RPL_NOWAWAY
 *
 *    Example:
 *
 *    AWAY :Gone to lunch.  Back in 5 ; Command to set away message to
 *                                    "Gone to lunch.  Back in 5".
 *
 * ##########################################################################
 */

var
	extend          = require('../../utility/extend'),
	Message_Command = require('../command');

var
	Enum_Commands = require('../../enum/commands'),
	Enum_Replies  = require('../../enum/replies');


class Message_Command_Away extends Message_Command {

	setText(away_message) {
		this.text = away_message;
		return this;
	}

	getText() {
		return this.text;
	}

	getValuesForParameters() {
		return {
			away_message: this.getText()
		};
	}

	setValuesFromParameters(parameters) {
		this.setText(parameters.get('away_message'));
	}

	getPossibleReplies() {
		return [
			Enum_Replies.RPL_UNAWAY,
			Enum_Replies.RPL_NOWAWAY
		];
	}

}

extend(Message_Command_Away.prototype, {
	command: Enum_Commands.AWAY,
	abnf:    '[ ":" <away-message> ]',
	text:    null
});

module.exports = Message_Command_Away;
