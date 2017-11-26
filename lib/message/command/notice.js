/**
 * From RFC2812:
 *
 * ##########################################################################
 *
 * 3.3.2 Notice
 *
 *       Command: NOTICE
 *    Parameters: <msgtarget> <text>
 *
 *    The NOTICE command is used similarly to PRIVMSG.  The difference
 *    between NOTICE and PRIVMSG is that automatic replies MUST NEVER be
 *    sent in response to a NOTICE message.  This rule applies to servers
 *    too - they MUST NOT send any error reply back to the client on
 *    receipt of a notice.  The object of this rule is to avoid loops
 *    between clients automatically sending something in response to
 *    something it received.
 *
 *    This command is available to services as well as users.
 *
 *    This is typically used by services, and automatons (clients with
 *    either an AI or other interactive program controlling their actions).
 *
 *    See PRIVMSG for more details on replies and examples.
 *
 * ##########################################################################
 */


var
	extend                  = require('../../utility/extend'),
	Message_Command_Private = require('../../message/command/private'),
	Enum_Commands           = require('../../enum/commands');


class Message_Command_Notice extends Message_Command_Private {

}

extend(Message_Command_Notice.prototype, {
	command: Enum_Commands.NOTICE
});

module.exports = Message_Command_Notice;
