/**
 * From RFC1459:
 *
 * ##########################################################################
 *
 * 4.2.1 Join message
 *
 *       Command: JOIN
 *    Parameters: <channel>{,<channel>} [<key>{,<key>}]
 *
 *    The JOIN command is used by client to start listening a specific
 *    channel. Whether or not a client is allowed to join a channel is
 *    checked only by the server the client is connected to; all other
 *    servers automatically add the user to the channel when it is received
 *    from other servers.  The conditions which affect this are as follows:
 *
 *            1.  the user must be invited if the channel is invite-only;
 *
 *            2.  the user's nick/username/hostname must not match any
 *                active bans;
 *
 *            3.  the correct key (password) must be given if it is set.
 *
 *    These are discussed in more detail under the MODE command (see
 *    section 4.2.3 for more details).
 *
 *    Once a user has joined a channel, they receive notice about all
 *    commands their server receives which affect the channel.  This
 *    includes MODE, KICK, PART, QUIT and of course PRIVMSG/NOTICE.  The
 *    JOIN command needs to be broadcast to all servers so that each server
 *    knows where to find the users who are on the channel.  This allows
 *    optimal delivery of PRIVMSG/NOTICE messages to the channel.
 *
 *    If a JOIN is successful, the user is then sent the channel's topic
 *    (using RPL_TOPIC) and the list of users who are on the channel (using
 *    RPL_NAMREPLY), which must include the user joining.
 *
 *    Numeric Replies:
 *
 *            ERR_NEEDMOREPARAMS              ERR_BANNEDFROMCHAN
 *            ERR_INVITEONLYCHAN              ERR_BADCHANNELKEY
 *            ERR_CHANNELISFULL               ERR_BADCHANMASK
 *            ERR_NOSUCHCHANNEL               ERR_TOOMANYCHANNELS
 *            RPL_TOPIC
 *
 *    Examples:
 *
 *    JOIN #foobar                    ; join channel #foobar.
 *
 *    JOIN &foo fubar                 ; join channel &foo using key "fubar".
 *
 *    JOIN #foo,&bar fubar            ; join channel #foo using key "fubar"
 *                                    and &bar using no key.
 *
 *    JOIN #foo,#bar fubar,foobar     ; join channel #foo using key "fubar".
 *                                    and channel #bar using key "foobar".
 *
 *    JOIN #foo,#bar                  ; join channels #foo and #bar.
 *
 *    :WiZ JOIN #Twilight_zone        ; JOIN message from WiZ
 *
 * ##########################################################################
 *
 */

var req = require('req');

var
	extend         = req('/utilities/extend'),
	ClientMessage  = req('/lib/client/message'),
	Commands       = req('/constants/commands'),
	ChannelDetails = req('/lib/channel-details');


class ClientJoinMessage extends ClientMessage {

	addChannelName(channel_name) {
		var channel_details = new ChannelDetails();

		channel_details.setName(channel_name);

		this.addTarget(channel_details);
	}

	setChannelKey(channel_name, channel_key) {
		this.getChannelKeys()[channel_name] = channel_key;
	}

	setChannelKeys(channel_names, channel_keys) {
		var index = 0;

		// Note: We count up to the number of channel keys;
		// not the number of channel names. There could be
		// more channel names supplied than channel keys,
		// in which case we should just ignore them.
		while (index < channel_keys.length) {
			let
				channel_name = channel_names[index],
				channel_key  = channel_keys[index];

			this.setChannelKey(channel_name, channel_key);
			index++;
		}
	}

	getChannelNames() {
		return this.getTargets().map(function map(target) {
			return target.getTargetString();
		});
	}

	setChannelNames(channel_names) {
		channel_names.forEach(this.addChannelName, this);
	}

	getChannelKeys() {
		if (!this.channel_keys) {
			this.channel_keys = { };
		}

		return this.channel_keys;
	}

	hasChannelKeys() {
		var keys = this.getChannelKeys();

		return Object.keys(keys).length > 0;
	}

	setBody(body) {
		super.setBody(body);

		var channel_names = body.split(',');

		channel_names.forEach(this.addChannelName, this);
	}

	hasKeyForChannelName(channel_name) {
		return this.getKeyForChannelName(channel_name) !== undefined;
	}

	getKeyForChannelName(channel_name) {
		return this.getChannelKeys()[channel_name];
	}

	serializeParams() {
		var result = this.serializeChannelNames();

		if (this.hasChannelKeys()) {
			result += ' ' + this.serializeChannelKeys();
		}

		return result;
	}

	sortChannels(a, b) {
		var
			key_a = this.getKeyForChannelName(a),
			key_b = this.getKeyForChannelName(b);

		if (!key_a && !key_b) {
			return 0;
		}

		if (key_a && key_b) {
			return 0;
		}

		if (key_a && !key_b) {
			return -1;
		}

		if (!key_a && key_b) {
			return 1;
		}

		throw new Error(`
			How did we get here?
		`);
	}

	getSortedChannelNames() {
		return this.getChannelNames().sort(this.sortChannels.bind(this));
	}

	serializeChannelNames() {
		return this.getSortedChannelNames().join(',');
	}

	serializeChannelKeys() {
		var
			channel_names = this.getSortedChannelNames(),
			channel_keys  = [ ];

		channel_names.forEach(function each(name) {
			var key = this.getKeyForChannelName(name);

			if (key) {
				channel_keys.push(key);
			}
		}, this);

		return channel_keys.join(',');
	}

	applyParsedParams(middle_params) {
		var
			channel_names = this.deserializeChannelNames(middle_params[0]),
			channel_keys  = this.deserializeChannelKeys(middle_params[1]);

		this.setChannelNames(channel_names);

		if (channel_keys) {
			this.setChannelKeys(
				channel_names.slice(0, channel_keys.length),
				channel_keys
			);
		}
	}

	deserializeChannelNames(channel_names_string) {
		return channel_names_string.split(',');
	}

	/**
	 * @param   {string} channel_keys_string
	 * @returns {array|null}
	 */
	deserializeChannelKeys(channel_keys_string) {
		if (!channel_keys_string) {
			return null;
		}

		return channel_keys_string.split(',');
	}

}

extend(ClientJoinMessage.prototype, {
	command:      Commands.JOIN,
	channel_keys: null
});

module.exports = ClientJoinMessage;
