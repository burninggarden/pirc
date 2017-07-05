
var
	extend       = req('/lib/utilities/extend'),
	ReplyMessage = req('/lib/messages/reply'),
	Replies      = req('/lib/constants/replies');


class NoNicknameGivenMessage extends ReplyMessage {

	getValuesForParameters() {
		return { };
	}

	setValuesFromParameters() {
		// Deliberately a noop.
	}

}

extend(NoNicknameGivenMessage.prototype, {

	reply: Replies.ERR_NONICKNAMEGIVEN,
	abnf:  '":No nickname given"'

});

module.exports = NoNicknameGivenMessage;
