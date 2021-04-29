
/**
 * From RFC2812:
 *
 * ##########################################################################
 *
 * 3.3.1 Private messages
 *
 *       Command: PRIVMSG
 *    Parameters: <msgtarget> <text to be sent>
 *
 *    PRIVMSG is used to send private messages between users, as well as to
 *    send messages to channels.  <msgtarget> is usually the nickname of
 *    the recipient of the message, or a channel name.
 *
 *    The <msgtarget> parameter may also be a host mask (#<mask>) or server
 *    mask ($<mask>).  In both cases the server will only send the PRIVMSG
 *    to those who have a server or host matching the mask.  The mask MUST
 *    have at least 1 (one) "." in it and no wildcards following the last
 *    ".".  This requirement exists to prevent people sending messages to
 *    "#*" or "$*", which would broadcast to all users.  Wildcards are the
 *    '*' and '?'  characters.  This extension to the PRIVMSG command is
 *    only available to operators.
 *
 *    Numeric Replies:
 *
 *            ERR_NORECIPIENT                 ERR_NOTEXTTOSEND
 *            ERR_CANNOTSENDTOCHAN            ERR_NOTOPLEVEL
 *            ERR_WILDTOPLEVEL                ERR_TOOMANYTARGETS
 *            ERR_NOSUCHNICK
 *            RPL_AWAY
 *
 *
 *    Examples:
 *
 *    :Angel!wings@irc.org PRIVMSG Wiz :Are you receiving this message ?
 *                                    ; Message from Angel to Wiz.
 *
 *    PRIVMSG Angel :yes I'm receiving it !
 *                                    ; Command to send a message to Angel.
 *
 *    PRIVMSG jto@tolsun.oulu.fi :Hello !
 *                                    ; Command to send a message to a user
 *                                    on server tolsun.oulu.fi with
 *                                    username of "jto".
 *
 *    PRIVMSG kalt%millennium.stealth.net@irc.stealth.net :Are you a frog?
 *                                    ; Message to a user on server
 *                                    irc.stealth.net with username of
 *                                    "kalt", and connected from the host
 *                                    millennium.stealth.net.
 *
 *    PRIVMSG kalt%millennium.stealth.net :Do you like cheese?
 *                                    ; Message to a user on the local
 *                                    server with username of "kalt", and
 *                                    connected from the host
 *                                    millennium.stealth.net.
 *
 *    PRIVMSG Wiz!jto@tolsun.oulu.fi :Hello !
 *                                    ; Message to the user with nickname
 *                                    Wiz who is connected from the host
 *                                    tolsun.oulu.fi and has the username
 *                                    "jto".
 *
 *    PRIVMSG $*.fi :Server tolsun.oulu.fi rebooting.
 *                                    ; Message to everyone on a server
 *                                    which has a name matching *.fi.
 *
 *    PRIVMSG #*.edu :NSFNet is undergoing work, expect interruptions
 *                                    ; Message to all users who come from
 *                                    a host which has a name matching
 *                                    *.edu.
 *
 * ##########################################################################
 */


var
	Heket = require('heket');

var
	Message_Command = require('../../message/command'),
	Enum_Commands   = require('../../enum/commands'),
	Enum_Replies    = require('../../enum/replies'),
	MessageBuilder  = require('../../message-builder');

var
	extend        = require('../../utility/extend'),
	isChannelName = require('../../utility/is-channel-name'),
	isNickname    = require('../../utility/is-nickname');

var
	Message_Reply_NeedMoreParameters = require('../reply/need-more-parameters');


class Message_Command_Private extends Message_Command {

	hasChannelMessageTargets() {
		return this.getChannelMessageTargets().length > 0;
	}

	getChannelMessageTargets() {
		return this.getTargets().filter(
			this.isChannelMessageTarget,
			this
		);
	}

	isChannelMessageTarget(target) {
		return isChannelName(target);
	}

	hasUserMessageTargets() {
		return this.getUserMessageTargets().length > 0;
	}

	getUserMessageTargets() {
		return this.getTargets().filter(
			this.isUserMessageTarget,
			this
		);
	}

	isUserMessageTarget(target) {
		// TODO: handle user ids as well
		return isNickname(target);
	}

	getMessageBody() {
		return this.message_body;
	}

	setMessageBody(message_body) {
		this.message_body = message_body;
		return this;
	}

	setWords(words) {
		var body = words.join(' ');

		this.setMessageBody(body);
	}

	handleParameterParsingError(error) {
		if (error instanceof Heket.InvalidQuotedStringError) {
			let message = new Message_Reply_NeedMoreParameters();

			message.setAttemptedCommand(this.getCommand());

			return this.setImmediateResponse(message);
		}
	}

	getValuesForParameters() {
		return {
			message_target: this.getTargets(),
			message_body:   this.getMessageBody()
		};
	}

	setValuesFromParameters(parameters) {
		this.setTargets(parameters.getAll('message_target'));
		this.setMessageBody(parameters.get('message_body'));
	}

	getPossibleReplies() {
		return [
			Enum_Replies.ERR_NORECIPIENT,
			Enum_Replies.ERR_NOTEXTTOSEND,
			Enum_Replies.ERR_CANNOTSENDTOCHAN,
			Enum_Replies.ERR_NOTOPLEVEL,
			Enum_Replies.ERR_WILDTOPLEVEL,
			Enum_Replies.ERR_TOOMANYTARGETS,
			Enum_Replies.ERR_NOSUCHNICK,
			Enum_Replies.RPL_AWAY
		];
	}

}

extend(Message_Command_Private.prototype, {
	command:      Enum_Commands.PRIVMSG,
	abnf:         '<message-target> *( "," <message-target> ) " :" <message-body>',
	message_body: null
});

function getMultipleChannelMessages(parameters) {
	var constructor = this;

	function createMessage() {
		return (new constructor())
			.setOmitPrefix(parameters.omit_prefix)
			.setTarget(parameters.channel_name);
	}

	return MessageBuilder.buildMultipleMessages(
		parameters.body,
		createMessage
	);
}

Message_Command_Private.getMultipleChannelMessages = getMultipleChannelMessages;

function getMultipleUserMessages(parameters) {
	var constructor = this;

	function createMessage() {
		return (new constructor())
			.setOmitPrefix(parameters.omit_prefix)
			.setTarget(parameters.nick);
	}

	return MessageBuilder.buildMultipleMessages(
		parameters.body,
		createMessage
	);
}

Message_Command_Private.getMultipleUserMessages = getMultipleUserMessages;



module.exports = Message_Command_Private;
