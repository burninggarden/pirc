
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

var req = require('req');

var
	extend        = req('/utilities/extend'),
	ClientMessage = req('/lib/client/message'),
	Commands      = req('/constants/commands');

class ClientPartMessage extends ClientMessage {

	constructor() {
		super();

		this.channel_names = [ ];
	}

	addChannelName(channel_name) {
		this.channel_names.push(channel_name);
	}

	getChannelNames() {
		return this.channel_names;
	}

	serialize() {
		return this.command + ' ' + this.getChannelNames().join(',');
	}

	deserialize() {
		var parts = this.getMessageParts();

		var channel_names = parts[1].split(',');

		channel_names.forEach(this.addChannelName, this);

		return this;
	}

}

extend(ClientPartMessage.prototype, {
	command:       Commands.PART,
	channel_names: null
});

module.exports = ClientPartMessage;
