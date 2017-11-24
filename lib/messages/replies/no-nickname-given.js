
var
	extend       = req('/lib/utilities/extend'),
	ReplyMessage = req('/lib/messages/reply'),
	Enum_Replies = req('/lib/enum/replies');


class NoNicknameGivenMessage extends ReplyMessage {

	getValuesForParameters() {
		return { };
	}

	setValuesFromParameters() {
		// Deliberately a noop.
	}

}

extend(NoNicknameGivenMessage.prototype, {

	reply: Enum_Replies.ERR_NONICKNAMEGIVEN,
	abnf:  '":No nickname given"'

});

module.exports = NoNicknameGivenMessage;
