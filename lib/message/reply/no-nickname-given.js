
var
	extend       = req('/lib/utility/extend'),
	ReplyMessage = req('/lib/message/reply'),
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
