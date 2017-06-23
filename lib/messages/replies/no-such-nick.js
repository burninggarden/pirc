
var
	extend               = req('/lib/utilities/extend'),
	ReplyMessage         = req('/lib/messages/reply'),
	Replies              = req('/lib/constants/replies'),
	InvalidNicknameError = req('/lib/errors/invalid-nickname'),
	ErrorReasons         = req('/lib/constants/error-reasons');


class NoSuchNickMessage extends ReplyMessage {

	getValuesForParameters() {
		return {
			nickname: this.getNickname()
		};
	}

	setValuesFromParameters(parameters) {
		this.setNickname(parameters.get('nickname'));

		// You may be wondering why we're checking for channel tokens inside
		// of a reply numeric that seems like it should be specific to nicks.
		// Well... some IRCD's (looking at you, InspIRCd) return information
		// about missing channel names using this numeric, as well.
		this.setChannelName(parameters.get('channel_name'));
	}

	toError() {
		return new InvalidNicknameError(this.getNickname(), ErrorReasons.NOT_FOUND);
	}

}

extend(NoSuchNickMessage.prototype, {
	reply: Replies.ERR_NOSUCHNICK,
	abnf:  '( <nick> / <channel> )" :No such nick/channel"'
});

module.exports = NoSuchNickMessage;
