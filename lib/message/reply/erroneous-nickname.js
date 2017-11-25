
var
	extend       = req('/lib/utility/extend'),
	ReplyMessage = req('/lib/message/reply'),
	Enum_Replies = req('/lib/enum/replies');


class ErroneousNicknameMessage extends ReplyMessage {

	getNickname() {
		return this.nickname;
	}

	setNickname(nickname) {
		this.nickname = nickname;
		return this;
	}

	getValuesForParameters() {
		return {
			attempted_nickname: this.getNickname()
		};
	}

	setValuesFromParameters(parameters) {
		this.setNickname(parameters.get('attempted_nickname'));
	}

}

extend(ErroneousNicknameMessage.prototype, {

	reply:    Enum_Replies.ERR_ERRONEUSNICKNAME,
	abnf:     '<attempted-nickname> " :Erroneous nickname"',
	nickname: null

});

module.exports = ErroneousNicknameMessage;
