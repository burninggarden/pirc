
var
	extend        = require('../../utility/extend'),
	Message_Reply = require('../../message/reply'),
	Enum_Replies  = require('../../enum/replies');


class Message_Reply_NoNicknameGiven extends Message_Reply {

	getValuesForParameters() {
		return { };
	}

	setValuesFromParameters() {
		// Deliberately a noop.
	}

}

extend(Message_Reply_NoNicknameGiven.prototype, {

	reply: Enum_Replies.ERR_NONICKNAMEGIVEN,
	abnf:  '":No nickname given"'

});

module.exports = Message_Reply_NoNicknameGiven;
