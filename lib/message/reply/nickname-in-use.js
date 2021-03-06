
var
	extend        = require('../../utility/extend'),
	Message_Reply = require('../../message/reply'),
	Enum_Replies  = require('../../enum/replies');


class Message_Reply_NicknameInUse extends Message_Reply {

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

extend(Message_Reply_NicknameInUse.prototype, {

	reply:    Enum_Replies.ERR_NICKNAMEINUSE,
	abnf:     '<nickname> " :Nickname is already in use"',
	nickname: null

});

module.exports = Message_Reply_NicknameInUse;
