/**
 * From RFC2813:
 *
 * ########################################################################
 *
 * 4.2.2 Njoin message
 *
 *       Command: NJOIN
 *    Parameters: <channel> [ "@@" / "@" ] [ "+" ] <nickname>
 *                          *( "," [ "@@" / "@" ] [ "+" ] <nickname> )
 *
 *    The NJOIN message is used between servers only.  If such a message is
 *    received from a client, it MUST be ignored.  It is used when two
 *    servers connect to each other to exchange the list of channel members
 *    for each channel.
 *
 *    Even though the same function can be performed by using a succession
 *    of JOIN, this message SHOULD be used instead as it is more efficient.
 *    The prefix "@@" indicates that the user is the "channel creator", the
 *    character "@" alone indicates a "channel operator", and the character
 *    '+' indicates that the user has the voice privilege.
 *
 *    Numeric Replies:
 *
 *            ERR_NEEDMOREPARAMS              ERR_NOSUCHCHANNEL
 *            ERR_ALREADYREGISTRED
 *
 *    Examples:
 *
 *    :ircd.stealth.net NJOIN #Twilight_zone :@WiZ,+syrk,avalon ; NJOIN
 *                                    message from ircd.stealth.net
 *                                    announcing users joining the
 *                                    #Twilight_zone channel: WiZ with
 *                                    channel operator status, syrk with
 *                                    voice privilege and avalon with no
 *                                    privilege.
 *
 * ########################################################################
 */


var
	extend          = require('../../utility/extend'),
	Message_Command = require('../command'),
	Enum_Commands   = require('../../enum/commands'),
	Enum_Replies    = require('../../enum/replies');


class Message_Command_Njoin extends Message_Command {

	setChannelName(channel_name) {
		this.channel_name = channel_name;
		return this;
	}

	getChannelName() {
		return this.channel_name;
	}

	getValuesForParameters() {
		return {
			channel_name: this.getChannelName()
		};
	}

	setValuesFromParameters(parameters) {
		this.setChannelName(parameters.get('channel_name'));
	}

	getPossibleReplies() {
		return [
			Enum_Replies.ERR_NEEDMOREPARAMS,
			Enum_Replies.ERR_NOSUCHCHANNEL,
			Enum_Replies.ERR_ALREADYREGISTRED
		];
	}

}

extend(Message_Command_Njoin.prototype, {
	command:      Enum_Commands.NJOIN,
	abnf:         '<channel-name> <channel-nick> *( "," <channel-nick> )',
	channel_name: null
});

module.exports = Message_Command_Njoin;
