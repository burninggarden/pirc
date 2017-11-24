
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
	extend       = req('/lib/utilities/extend'),
	add          = req('/lib/utilities/add'),
	remove       = req('/lib/utilities/remove'),
	ReplyMessage = req('/lib/messages/reply'),
	Enum_Replies = req('/lib/enum/replies');


class NamesReplyMessage extends ReplyMessage {

	setChannelName(channel_name) {
		this.channel_name = channel_name;
		return this;
	}

	getChannelName() {
		return this.channel_name;
	}

	setChannelPrivacySignifier(privacy_signifier) {
		this.privacy_signifier = privacy_signifier;
		return this;
	}

	getChannelPrivacySignifier() {
		return this.privacy_signifier;
	}

	setWords(words) {
		return this.setNames(words);
	}

	setNames(names) {
		this.names = names;
		return this;
	}

	getNames() {
		if (!this.names) {
			this.names = [ ];
		}

		return this.names;
	}

	addName(name) {
		add(name).to(this.getNames());
		return this;
	}

	removeName(name) {
		remove(name).from(this.getNames());
		return this;
	}

	getValuesForParameters() {
		return {
			channel_name:    this.getChannelName(),
			channel_privacy: this.getChannelPrivacySignifier(),
			channel_nick:    this.getNames()
		};
	}

	setValuesFromParameters(parameters) {
		this.setChannelName(parameters.get('channel_name'));
		this.setChannelPrivacySignifier(parameters.get('channel_privacy'));
		this.setNames(parameters.getAll('channel_nick'));
	}

}

extend(NamesReplyMessage.prototype, {

	reply:             Enum_Replies.RPL_NAMREPLY,
	abnf:              '<channel-privacy> " " <channel-name> " :" <channel-nick> *( " " <channel-nick>)',
	channel_name:      null,
	privacy_signifier: null

});

module.exports = NamesReplyMessage;
