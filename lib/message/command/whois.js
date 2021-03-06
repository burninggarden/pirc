
/**
 * From RFC1459:
 *
 * ##########################################################################
 *
 * 3.6.2 Whois query
 *
 *       Command: WHOIS
 *    Parameters: [ <target> ] <mask> *( "," <mask> )
 *
 *    This command is used to query information about particular user.
 *    The server will answer this command with several numeric messages
 *    indicating different statuses of each user which matches the mask (if
 *    you are entitled to see them).  If no wildcard is present in the
 *    <mask>, any information about that nick which you are allowed to see
 *    is presented.
 *
 *    If the <target> parameter is specified, it sends the query to a
 *    specific server.  It is useful if you want to know how long the user
 *    in question has been idle as only local server (i.e., the server the
 *    user is directly connected to) knows that information, while
 *    everything else is globally known.
 *
 *    Wildcards are allowed in the <target> parameter.
 *
 *    Numeric Replies:
 *
 *            ERR_NOSUCHSERVER              ERR_NONICKNAMEGIVEN
 *            RPL_WHOISUSER                 RPL_WHOISCHANNELS
 *            RPL_WHOISCHANNELS             RPL_WHOISSERVER
 *            RPL_AWAY                      RPL_WHOISOPERATOR
 *            RPL_WHOISIDLE                 ERR_NOSUCHNICK
 *            RPL_ENDOFWHOIS
 *
 *
 *    Examples:
 *
 *    WHOIS wiz                       ; return available user information
 *                                    about nick WiZ
 *
 *    WHOIS eff.org trillian          ; ask server eff.org for user
 *                                    information  about trillian
 *
 * ##########################################################################
 */

var
	extend          = require('../../utility/extend'),
	Message_Command = require('../command'),
	Enum_Commands   = require('../../enum/commands'),
	Enum_Replies    = require('../../enum/replies');


class Message_Command_Whois extends Message_Command {

	getValuesForParameters() {
		return {
			hostname: this.getHostname(),
			mask:     this.getMasks()
		};
	}

	setValuesFromParameters(parameters) {
		this.setHostname(parameters.get('hostname'));
		this.setMasks(parameters.getAll('mask'));
	}

	getPossibleReplies() {
		return [
			Enum_Replies.ERR_NOSUCHSERVER,
			Enum_Replies.ERR_NONICKNAMEGIVEN,
			Enum_Replies.RPL_WHOISUSER,
			Enum_Replies.RPL_WHOISCHANNELS,
			Enum_Replies.RPL_WHOISCHANNELS,
			Enum_Replies.RPL_WHOISSERVER,
			Enum_Replies.RPL_AWAY,
			Enum_Replies.RPL_WHOISOPERATOR,
			Enum_Replies.RPL_WHOISIDLE,
			Enum_Replies.ERR_NOSUCHNICK,
			Enum_Replies.RPL_ENDOFWHOIS
		];
	}

}

extend(Message_Command_Whois.prototype, {
	command: Enum_Commands.WHOIS,
	abnf:    '[ <hostname> ] <mask> *( "," <mask> )'
});

module.exports = Message_Command_Whois;
