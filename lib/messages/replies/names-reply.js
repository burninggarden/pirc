
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

var
	extend        = req('/lib/utilities/extend'),
	add           = req('/lib/utilities/add'),
	remove        = req('/lib/utilities/remove'),
	ReplyMessage  = req('/lib/messages/reply'),
	ReplyNumerics = req('/lib/constants/reply-numerics');


class NamesReplyMessage extends ReplyMessage {

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

	serializeParameters() {
		var
			targets           = this.serializeTargets(),
			channel_details   = this.getChannelDetails(),
			privacy_signifier = channel_details.getPrivacySignifier(),
			channel           = channel_details.getName(),
			body              = this.getBody();

		return `${targets} ${privacy_signifier} ${channel} :${body}`;
	}

	applyParsedParameters(middle_parameters, trailing_parameter) {
		this.setTargetStrings(middle_parameters[0].split(','));

		var channel_details = this.getChannelDetails();

		channel_details.applyPrivacySignifier(middle_parameters[1]);

		var channel_name = middle_parameters[2];

		channel_details.setName(channel_name);

		if (!trailing_parameter.length) {
			// If the trailing parameter is empty, we can simply bail out.
			// Not sure under what circumstances this would ever happen,
			// but better safe than sorry.
			return;
		}

		var names = trailing_parameter.trim().split(' ');

		this.setNames(names);
	}

}

extend(NamesReplyMessage.prototype, {

	reply_numeric:     ReplyNumerics.RPL_NAMREPLY,
	channel_is_public: true,
	channel_is_secret: false

});

module.exports = NamesReplyMessage;
