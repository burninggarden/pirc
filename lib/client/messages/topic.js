
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
	extend        = req('/lib/utilities/extend'),
	ClientMessage = req('/lib/client/message'),
	Commands      = req('/lib/constants/commands');

class ClientTopicMessage extends ClientMessage {

	setTopic(topic) {
		this.topic = topic;
	}

	getTopic() {
		return this.topic;
	}

	hasTopic() {
		return this.topic !== null;
	}

	serializeParams() {
		if (this.hasTopic()) {
			return this.serializeTargets() + ' :' + this.getTopic();
		} else {
			return this.serializeTargets();
		}
	}

	applyParsedParams(middle_params, trailing_param) {
		this.addTargetFromString(middle_params.shift());

		// Hopefully clients pass the topic in as the trailing parameter,
		// but if they don't prefix it with the ":" delimiter and instead
		// pass it as part of the formal middle parameters to the command,
		// let's at least try to give them partial credit.
		if (trailing_param) {
			this.setTopic(trailing_param);
		} else if (middle_params.length) {
			this.setTopic(middle_params.shift());
		}
	}

}

extend(ClientTopicMessage.prototype, {
	command: Commands.TOPIC,
	topic:   null
});

module.exports = ClientTopicMessage;
