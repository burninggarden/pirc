
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
	extend          = req('/lib/utility/extend'),
	add             = req('/lib/utility/add'),
	Message_Command = req('/lib/message/command'),
	Enum_Commands   = req('/lib/enum/commands');

class Message_Command_Part extends Message_Command {

	setChannelName(channel_name) {
		return this.setChannelNames([channel_name]);
	}

	setChannelNames(channel_names) {
		this.channel_names = channel_names;
		return this;
	}

	addChannelName(channel_name) {
		add(channel_name).to(this.getChannelNames());

		return this;
	}

	getChannelNames() {
		if (!this.channel_names) {
			this.channel_names = [ ];
		}

		return this.channel_names;
	}

	getChannelName() {
		return this.getChannelNames()[0];
	}

	getValuesForParameters() {
		return {
			channel_name: this.getChannelNames()
		};
	}

	setValuesFromParameters(parameters) {
		this.setChannelNames(parameters.getAll('channel_name'));
	}

}

extend(Message_Command_Part.prototype, {
	command:       Enum_Commands.PART,
	abnf:          '<channel-name> *("," <channel-name>)',
	channel_names: null
});

module.exports = Message_Command_Part;
