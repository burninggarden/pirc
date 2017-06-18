
var
	extend           = req('/lib/utilities/extend'),
	ReplyMessage     = req('/lib/messages/reply'),
	Replies          = req('/lib/constants/replies'),
	InvalidNickError = req('/lib/errors/invalid-nick'),
	ErrorReasons     = req('/lib/constants/error-reasons');


class NoSuchNickMessage extends ReplyMessage {

	getValuesForParameters() {
		return {
			nick: this.getNick()
		};
	}

	setValuesFromParameters(parameters) {
		this.setNick(parameters.get('nick'));

		// You may be wondering why we're checking for channel tokens inside
		// of a reply numeric that seems like it should be specific to nicks.
		// Well... some IRCD's (looking at you, InspIRCd) return information
		// about missing channel names using this numeric, as well.
		this.setChannelName(parameters.get('channel_name'));
	}

	toError() {
		return new InvalidNickError(this.getNick(), ErrorReasons.NOT_FOUND);
	}

}

extend(NoSuchNickMessage.prototype, {
	reply: Replies.ERR_NOSUCHNICK
});

module.exports = NoSuchNickMessage;
