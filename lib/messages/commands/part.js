
/**
 * From RFC1459:
 *
 * ##########################################################################
 *
 * 4.2.2 Part message
 *
 *      Command: PART
 *   Parameters: <channel>{,<channel>}
 *
 *   The PART message causes the client sending the message to be removed
 *   from the list of active users for all given channels listed in the
 *   parameter string.
 *
 *   Numeric Replies:
 *
 *           ERR_NEEDMOREPARAMS              ERR_NOSUCHCHANNEL
 *           ERR_NOTONCHANNEL
 *
 *   Examples:
 *
 *   PART #twilight_zone             ; leave channel "#twilight_zone"
 *
 *   PART #oz-ops,&group5            ; leave both channels "&group5" and
 *                                   "#oz-ops".
 *
 * ##########################################################################
 *
 */

var
	extend         = req('/lib/utilities/extend'),
	CommandMessage = req('/lib/messages/command'),
	Commands       = req('/lib/constants/commands'),
	ChannelDetails = req('/lib/channel-details');

class PartMessage extends CommandMessage {

	addChannelName(channel_name) {
		var target = ChannelDetails.fromName(channel_name);

		this.addTarget(target);
	}

	getChannelNames() {
		return this.getChannelTargetStrings();
	}

	serializeParameters() {
		return this.serializeTargets();
	}

	applyParsedParameters(middle_parameters) {
		this.setChannelNames(middle_parameters);
	}

}

extend(PartMessage.prototype, {
	command: Commands.PART
});

module.exports = PartMessage;
