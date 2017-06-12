
/**
 * From RFC1459:
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
 */

var
	extend         = req('/lib/utilities/extend'),
	CommandMessage = req('/lib/messages/command'),
	Commands       = req('/lib/constants/commands');


class WhoisMessage extends CommandMessage {

	serializeParameters() {
		return this.serializeTargets();
	}

	applyParsedParameters(middle_parameters, trailing_parameter) {
		this.addTargetFromString(middle_parameters.shift());
	}

}

extend(WhoisMessage.prototype, {
	command: Commands.WHOIS
});

module.exports = WhoisMessage;
