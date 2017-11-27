
/**
 * From RFC2812:
 *
 * ##########################################################################
 *
 * 3.2.4 Topic message
 *
 *       Command: TOPIC
 *    Parameters: <channel> [ <topic> ]
 *
 *    The TOPIC command is used to change or view the topic of a channel.
 *    The topic for channel <channel> is returned if there is no <topic>
 *    given.  If the <topic> parameter is present, the topic for that
 *    channel will be changed, if this action is allowed for the user
 *    requesting it.  If the <topic> parameter is an empty string, the
 *    topic for that channel will be removed.
 *
 *
 *    Numeric Replies:
 *
 *            ERR_NEEDMOREPARAMS              ERR_NOTONCHANNEL
 *            RPL_NOTOPIC                     RPL_TOPIC
 *            ERR_CHANOPRIVSNEEDED            ERR_NOCHANMODES
 *
 *    Examples:
 *
 *    :WiZ!jto@tolsun.oulu.fi TOPIC #test :New topic ; User Wiz setting the
 *                                    topic.
 *
 *    TOPIC #test :another topic      ; Command to set the topic on #test
 *                                    to "another topic".
 *
 *    TOPIC #test :                   ; Command to clear the topic on
 *                                    #test.
 *
 *    TOPIC #test                     ; Command to check the topic for
 *                                    #test.
 *
 * ##########################################################################
 */

var
	extend                = require('../../utility/extend'),
	Message_Command       = require('../command'),
	Enum_Commands         = require('../../enum/commands'),
	Enum_Replies          = require('../../enum/replies'),
	Validator_ChannelName = require('../../validator/channel-name');

class Message_Command_Topic extends Message_Command {

	setChannelName(channel_name) {
		Validator_ChannelName.validate(channel_name);

		this.channel_name = channel_name;
		return this;
	}

	getChannelName() {
		return this.channel_name;
	}

	setChannelTopic(channel_topic) {
		this.channel_topic = channel_topic;
		return this;
	}

	getChannelTopic() {
		return this.channel_topic;
	}

	hasChannelTopic() {
		return this.channel_topic !== null;
	}

	getValuesForParameters() {
		return {
			channel_name:  this.getChannelName(),
			channel_topic: this.getChannelTopic()
		};
	}

	setValuesFromParameters(parameters) {
		this.setChannelName(parameters.get('channel_name'));
		this.setChannelTopic(parameters.get('channel_topic'));
	}

	getPossibleReplies() {
		return [
			Enum_Replies.ERR_NEEDMOREPARAMS,
			Enum_Replies.ERR_NOTONCHANNEL,
			Enum_Replies.RPL_NOTOPIC,
			Enum_Replies.RPL_TOPIC,
			Enum_Replies.ERR_CHANOPRIVSNEEDED,
			Enum_Replies.ERR_NOCHANMODES
		];
	}

}

extend(Message_Command_Topic.prototype, {
	command:       Enum_Commands.TOPIC,
	abnf:          '<channel-name> [ " :" <channel-topic> ]',
	channel_topic: null,
	channel_name:  null
});

module.exports = Message_Command_Topic;
