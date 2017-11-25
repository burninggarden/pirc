
var
	extend       = req('/lib/utility/extend'),
	ReplyMessage = req('/lib/message/reply'),
	Enum_Replies = req('/lib/enum/replies');


class NicknameInUseMessage extends ReplyMessage {

	setNickname(nickname) {
		this.nickname = nickname;
		return this;
	}

	getNickname() {
		return this.nickname;
	}

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

	reply:    Enum_Replies.ERR_NICKNAMEINUSE,
	abnf:     '<nickname> " :Nickname is already in use"',
	nickname: null

});

module.exports = NicknameInUseMessage;
