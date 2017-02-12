

/**
 * From RFC1459:
 *
 * 353     RPL_NAMREPLY
 *                 "<channel> :[[@|+]<nick> [[@|+]<nick> [...]]]"
 * 366     RPL_ENDOFNAMES
 *                 "<channel> :End of /NAMES list"
 *
 *         - To reply to a NAMES message, a reply pair consisting
 *           of RPL_NAMREPLY and RPL_ENDOFNAMES is sent by the
 *           server back to the client.  If there is no channel
 *           found as in the query, then only RPL_ENDOFNAMES is
 *           returned.  The exception to this is when a NAMES
 *           message is sent with no parameters and all visible
 *           channels and contents are sent back in a series of
 *           RPL_NAMEREPLY messages with a RPL_ENDOFNAMES to mark
 *           the end.
 *
 */

var req = require('req');

var
	extend        = req('/utilities/extend'),
	add           = req('/utilities/add'),
	remove        = req('/utilities/remove'),
	ServerMessage = req('/lib/server/message'),
	ReplyNumerics = req('/constants/reply-numerics');


class ServerNamesReplyMessage extends ServerMessage {

	constructor() {
		super();
		this.names = [ ];
	}

	isFromServer() {
		return true;
	}

	setNames(names) {
		this.names = names;
		return this;
	}

	getNames() {
		return this.names;
	}

	addName(name) {
		add(name).to(this.names);
		return this;
	}

	removeName(name) {
		remove(name).from(this.names);
		return this;
	}

	serializeParams() {
		var
			targets           = this.serializeTargets(),
			channel_details   = this.getChannelDetails(),
			privacy_signifier = channel_details.getPrivacySignifier(),
			channel           = channel_details.getName(),
			names             = this.getNames().join(' ');

		return `${targets} ${privacy_signifier} ${channel} :${names}`;
	}

	applyParsedParams(middle_params, trailing_param) {
		this.setTargetStrings(middle_params[0].split(','));

		var channel_details = this.getChannelDetails();

		channel_details.applyPrivacySignifier(middle_params[1]);

		var channel_name = middle_params[2];

		channel_details.setName(channel_name);

		if (!trailing_param.length) {
			// If the trailing parameter is empty, we can simply bail out.
			// Not sure under what circumstances this would ever happen,
			// but better safe than sorry.
			return;
		}

		var names = trailing_param.split(' ');

		this.setNames(names);
	}

}

extend(ServerNamesReplyMessage.prototype, {

	reply_numeric:     ReplyNumerics.RPL_NAMREPLY,
	channel_is_public: true,
	channel_is_secret: false

});

module.exports = ServerNamesReplyMessage;
