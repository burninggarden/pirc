/**
 * From RFC1459:
 *
 * 4.4.1 Private messages
 *
 *       Command: PRIVMSG
 *    Parameters: <receiver>{,<receiver>} <text to be sent>
 *
 *    PRIVMSG is used to send private messages between users.  <receiver>
 *    is the nickname of the receiver of the message.  <receiver> can also
 *    be a list of names or channels separated with commas.
 *
 *    The <receiver> parameter may also me a host mask  (#mask)  or  server
 *    mask  ($mask).   In  both cases the server will only send the PRIVMSG
 *    to those who have a server or host matching the mask.  The mask  must
 *    have at  least  1  (one)  "."  in it and no wildcards following the
 *    last ".".  This requirement exists to prevent people sending messages
 *    to  "#*"  or "$*",  which  would  broadcast  to  all  users; from
 *    experience, this is abused more than used responsibly and properly.
 *    Wildcards are  the  '*' and  '?'   characters.   This  extension  to
 *    the PRIVMSG command is only available to Operators.
 *
 *    Numeric Replies:
 *
 *            ERR_NORECIPIENT                 ERR_NOTEXTTOSEND
 *            ERR_CANNOTSENDTOCHAN            ERR_NOTOPLEVEL
 *            ERR_WILDTOPLEVEL                ERR_TOOMANYTARGETS
 *            ERR_NOSUCHNICK
 *            RPL_AWAY
 *
 *    Examples:
 *
 * :Angel PRIVMSG Wiz :Hello are you receiving this message ?
 *                                 ; Message from Angel to Wiz.
 *
 * PRIVMSG Angel :yes I'm receiving it !
 *                                 ; Message to Angel.
 *
 * PRIVMSG jto@tolsun.oulu.fi :Hello !
 *                                 ; Message to a client on server
 *                                 tolsun.oulu.fi with username of "jto".
 *
 * PRIVMSG $*.fi :Server tolsun.oulu.fi rebooting.
 *                                 ; Message to everyone on a server which
 *                                 has a name matching *.fi.
 *
 * PRIVMSG #*.edu :NSFNet is undergoing work, expect interruptions
 *                                 ; Message to all users who come from a
 *                                 host which has a name matching *.edu.
 *
 */



var
	extend         = req('/lib/utilities/extend'),
	CommandMessage = req('/lib/messages/command'),
	Commands       = req('/lib/constants/commands'),
	Delimiters     = req('/lib/constants/delimiters'),
	MessageBuilder = req('/lib/message-builder'),
	ChannelDetails = req('/lib/channel-details'),
	UserDetails    = req('/lib/user-details');


class PrivateMessage extends CommandMessage {

	serializeParameters() {
		return this.serializeTargets() + ' ' + Delimiters.COLON + this.body;
	}

	applyParsedParameters(middle_parameters, trailing_parameter) {
		this.setTargetStrings(middle_parameters);
		this.setBody(trailing_parameter);
	}

}

extend(PrivateMessage.prototype, {
	command: Commands.PRIVMSG
});

function getMultipleChannelMessages(parameters) {
	var constructor = this;

	function createMessage() {
		var
			message = new constructor(),
			target  = ChannelDetails.fromName(parameters.channel_name);

		message.addTarget(target);

		return message;
	}

	return MessageBuilder.buildMultipleMessages(
		parameters.body,
		createMessage
	);
}

PrivateMessage.getMultipleChannelMessages = getMultipleChannelMessages;

function getMultipleUserMessages(parameters) {
	var constructor = this;

	function createMessage() {
		var
			message = new constructor(),
			target  = UserDetails.fromNick(parameters.nick);

		message.addTarget(target);

		return message;
	}

	return MessageBuilder.buildMultipleMessages(
		parameters.body,
		createMessage
	);
}

PrivateMessage.getMultipleUserMessages = getMultipleUserMessages;



module.exports = PrivateMessage;
