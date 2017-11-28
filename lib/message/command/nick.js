
/**
 * From RFC1459/RFC2812:
 *
 * ########################################################################
 *
 * 4.1.2 Nick message
 *
 *       Command: NICK
 *    Parameters: <nickname> [ <hopcount> ]
 *
 *    NICK message is used to give user a nickname or change the previous
 *    one.  The <hopcount> parameter is only used by servers to indicate
 *    how far away a nick is from its home server.  A local connection has
 *    a hopcount of 0.  If supplied by a client, it must be ignored.
 *
 *    If a NICK message arrives at a server which already knows about an
 *    identical nickname for another client, a nickname collision occurs.
 *    As a result of a nickname collision, all instances of the nickname
 *    are removed from the server's database, and a KILL command is issued
 *    to remove the nickname from all other server's database. If the NICK
 *    message causing the collision was a nickname change, then the
 *    original (old) nick must be removed as well.
 *
 *    If the server recieves an identical NICK from a client which is
 *    directly connected, it may issue an ERR_NICKCOLLISION to the local
 *    client, drop the NICK command, and not generate any kills.
 *
 *    Numeric Replies:
 *
 *            ERR_NONICKNAMEGIVEN             ERR_ERRONEUSNICKNAME
 *            ERR_NICKNAMEINUSE               ERR_NICKCOLLISION
 *            ERR_UNAVAILRESOURCE             ERR_RESTRICTED
 *
 *    Examples:
 *
 *    NICK Wiz                ; Introducing new nick "Wiz" if session is
 *                            still unregistered, or user changing his
 *                            nickname to "Wiz"
 *
 *    :WiZ!jto@tolsun.oulu.fi NICK Kilroy
 *                            ; Server telling that WiZ changed his
 *                            nickname to Kilroy.
 *
 *
 * ########################################################################
 */

var
	Heket = require('heket');

var
	extend          = require('../../utility/extend'),
	Message_Command = require('../../message/command'),
	Enum_Commands   = require('../../enum/commands'),
	Enum_Replies    = require('../../enum/replies');

var
	Message_Reply_NoNicknameGiven   = require('../../message/reply/no-nickname-given'),
	Message_Reply_ErroneousNickname = require('../../message/reply/erroneous-nickname');


class Message_Command_Nick extends Message_Command {

	setNickname(nickname) {
		this.nickname = nickname;
		return this;
	}

	getNickname() {
		return this.nickname;
	}

	setHopCount(hop_count) {
		this.hop_count = hop_count;
		return this;
	}

	getHopCount() {
		return this.hop_count;
	}

	getValuesForParameters() {
		return {
			nickname:  this.getNickname(),
			hop_count: this.getHopCount()
		};
	}

	setValuesFromParameters(parameters) {
		this.setNickname(parameters.get('nickname'));
		this.setHopCount(parameters.get('hop_count'));
	}

	handleParameterParsingError(error) {
		if (
			   error instanceof Heket.MissingRuleValueError
			&& error.getRuleName() === 'nickname'
		) {
			return void this.setImmediateResponse(new Message_Reply_NoNicknameGiven());
		}

		if (
			   error instanceof Heket.InvalidRuleValueError
			&& error.getRuleName() === 'nickname'
		) {
			let message = new Message_Reply_ErroneousNickname();

			message.setNickname(error.getValue());

			return void this.setImmediateResponse(message);
		}
	}

	getPossibleReplies() {
		return [
			Enum_Replies.ERR_NONICKNAMEGIVEN,
			Enum_Replies.ERR_ERRONEUSNICKNAME,
			Enum_Replies.ERR_NICKNAMEINUSE,
			Enum_Replies.ERR_NICKCOLLISION,
			Enum_Replies.ERR_UNAVAILRESOURCE,
			Enum_Replies.ERR_RESTRICTED
		];
	}

}

extend(Message_Command_Nick.prototype, {
	command:   Enum_Commands.NICK,
	abnf:      '<nickname> [ " " <hop-count> ]',
	hop_count: null,
	nickname:  null
});

module.exports = Message_Command_Nick;