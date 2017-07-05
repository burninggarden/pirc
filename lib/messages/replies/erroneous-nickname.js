
var
	extend       = req('/lib/utilities/extend'),
	ReplyMessage = req('/lib/messages/reply'),
	Replies      = req('/lib/constants/replies');


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

	reply:    Replies.ERR_ERRONEUSNICKNAME,
	abnf:     '<attempted-nickname> " :Erroneous nickname"',
	nickname: null

});

module.exports = ErroneousNicknameMessage;
