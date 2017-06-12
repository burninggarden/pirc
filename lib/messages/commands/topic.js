
/**
 * From RFC1459:
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
 */

var
	extend         = req('/lib/utilities/extend'),
	CommandMessage = req('/lib/messages/command'),
	Commands       = req('/lib/constants/commands');

class TopicMessage extends CommandMessage {

	setTopic(topic) {
		this.topic = topic;
	}

	getTopic() {
		return this.topic;
	}

	hasTopic() {
		return this.topic !== null;
	}

	serializeParameters() {
		if (this.hasTopic()) {
			return this.serializeTargets() + ' :' + this.getTopic();
		} else {
			return this.serializeTargets();
		}
	}

	applyParsedParameters(middle_parameters, trailing_parameter) {
		this.addTargetFromString(middle_parameters.shift());

		// Hopefully clients pass the topic in as the trailing parameter,
		// but if they don't prefix it with the ":" delimiter and instead
		// pass it as part of the formal middle parameters to the command,
		// let's at least try to give them partial credit.
		if (trailing_parameter) {
			this.setTopic(trailing_parameter);
		} else if (middle_parameters.length) {
			this.setTopic(middle_parameters.shift());
		}
	}

}

extend(TopicMessage.prototype, {
	command: Commands.TOPIC,
	topic:   null
});

module.exports = TopicMessage;
