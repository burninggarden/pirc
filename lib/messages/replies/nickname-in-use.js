
var
	extend       = req('/lib/utilities/extend'),
	ReplyMessage = req('/lib/messages/reply'),
	Replies      = req('/lib/constants/replies');


class NicknameInUseMessage extends ReplyMessage {

	getValuesForParameters() {
		return {
			nickname: this.getNickname()
		};
	}

	setValuesFromParameters(parameters) {
		this.setNickname(parameters.get('nickname'));
	}

}

extend(NicknameInUseMessage.prototype, {

	reply: Replies.ERR_NICKNAMEINUSE,
	abnf:  '<nick> " :Nickname is already in use"'

});

module.exports = NicknameInUseMessage;
