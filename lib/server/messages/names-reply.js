

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
			targets = this.serializeTargets(),
			channel = this.getChannelName(),
			names   = this.getNames().join(' ');

		return `${targets} ${channel} :${names}`;
	}

	applyParsedParams(middle_params, trailing_param) {
		var channel_name = middle_params[1];

		this.setChannelName(channel_name);

		var names = trailing_param.split(' ');

		this.setNames(names);
	}

}

extend(ServerNamesReplyMessage.prototype, {

	reply_numeric: ReplyNumerics.RPL_NAMREPLY,

});

module.exports = ServerNamesReplyMessage;
