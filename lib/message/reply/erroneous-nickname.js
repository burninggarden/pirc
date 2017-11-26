
var
	extend        = require('../../utility/extend'),
	Message_Reply = require('../../message/reply'),
	Enum_Replies  = require('../../enum/replies');


class Message_Reply_ErroneousNickname extends Message_Reply {

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

extend(Message_Reply_ErroneousNickname.prototype, {

	reply:    Enum_Replies.ERR_ERRONEUSNICKNAME,
	abnf:     '<attempted-nickname> " :Erroneous nickname"',
	nickname: null

});

module.exports = Message_Reply_ErroneousNickname;
