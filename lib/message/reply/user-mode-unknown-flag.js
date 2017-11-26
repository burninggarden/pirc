
var
	extend        = require('../../utility/extend'),
	Message_Reply = require('../../message/reply'),
	Enum_Replies  = require('../../enum/replies');


class Message_Reply_UserModeUnknownFlag extends Message_Reply {

	getValuesForParameters() {
		return { };
	}

	setValuesFromParameters() {
		// Deliberately a noop.
	}

}

extend(Message_Reply_UserModeUnknownFlag.prototype, {
	reply: Enum_Replies.ERR_UMODEUNKNOWNFLAG,
	abnf:  '":Unknown MODE flag"'
});

module.exports = Message_Reply_UserModeUnknownFlag;
