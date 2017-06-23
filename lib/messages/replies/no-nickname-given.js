
var
	extend               = req('/lib/utilities/extend'),
	ReplyMessage         = req('/lib/messages/reply'),
	Replies              = req('/lib/constants/replies'),
	InvalidNicknameError = req('/lib/errors/invalid-nickname'),
	ErrorReasons         = req('/lib/constants/error-reasons');


class NoNicknameGivenMessage extends ReplyMessage {

	getValuesForParameters() {
		return { };
	}

	setValuesFromParameters() {
		// Deliberately a noop.
	}

	toError() {
		return new InvalidNicknameError(undefined, ErrorReasons.OMITTED);
	}

}

extend(NoNicknameGivenMessage.prototype, {

	reply: Replies.ERR_NONICKNAMEGIVEN,
	abnf:  '":No nickname given"'

});

module.exports = NoNicknameGivenMessage;
