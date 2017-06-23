
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
	Commands       = req('/lib/constants/commands');

class PartMessage extends CommandMessage {

	getValuesForParameters() {
		return {
			channel_name: this.getChannelNames()
		};
	}

	setValuesFromParameters(parameters) {
		this.setChannelNames(parameters.getAll('channel_name'));
	}

}

extend(PartMessage.prototype, {
	command: Commands.PART,
	abnf:    '<channel-name> *("," <channel-name>)'
});

module.exports = PartMessage;
