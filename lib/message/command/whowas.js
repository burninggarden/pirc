
/**
 * From RFC2812:
 *
 * ##########################################################################
 *
 * 3.6.3 Whowas
 *
 *       Command: WHOWAS
 *    Parameters: <nickname> *( "," <nickname> ) [ <count> [ <target> ] ]
 *
 *    Whowas asks for information about a nickname which no longer exists.
 *    This may either be due to a nickname change or the user leaving IRC.
 *    In response to this query, the server searches through its nickname
 *    history, looking for any nicks which are lexically the same (no wild
 *    card matching here).  The history is searched backward, returning the
 *    most recent entry first.  If there are multiple entries, up to
 *    <count> replies will be returned (or all of them if no <count>
 *    parameter is given).  If a non-positive number is passed as being
 *    <count>, then a full search is done.
 *
 *    Wildcards are allowed in the <target> parameter.
 *
 *    Numeric Replies:
 *
 *            ERR_NONICKNAMEGIVEN           ERR_WASNOSUCHNICK
 *            RPL_WHOWASUSER                RPL_WHOISSERVER
 *            RPL_ENDOFWHOWAS
 *
 *    Examples:
 *
 *    WHOWAS Wiz                      ; return all information in the nick
 *                                    history about nick "WiZ";
 *
 *    WHOWAS Mermaid 9                ; return at most, the 9 most recent
 *                                    entries in the nick history for
 *                                    "Mermaid";
 *
 *    WHOWAS Trillian 1 *.edu         ; return the most recent history for
 *                                    "Trillian" from the first server
 *                                    found to match "*.edu".
 *
 * ##########################################################################
 */

var
	extend          = require('../../utility/extend'),
	Message_Command = require('../command'),
	Enum_Commands   = require('../../enum/commands'),
	Enum_Replies    = require('../../enum/replies');


class Message_Command_Whowas extends Message_Command {

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
			Enum_Replies.ERR_NONICKNAMEGIVEN,
			Enum_Replies.ERR_WASNOSUCHNICK,
			Enum_Replies.RPL_WHOWASUSER,
			Enum_Replies.RPL_WHOISSERVER,
			Enum_Replies.RPL_ENDOFWHOWAS
		];
	}

}

extend(Message_Command_Whowas.prototype, {
	command: Enum_Commands.WHOWAS,
	abnf:    '[ <hostname> ] <mask> *( "," <mask> )'
});

module.exports = Message_Command_Whowas;
