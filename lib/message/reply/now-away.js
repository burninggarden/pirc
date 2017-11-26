
var
	extend        = require('../../utility/extend'),
	Message_Reply = require('../../message/reply'),
	Enum_Replies  = require('../../enum/replies');

class Message_Reply_NowAway extends Message_Reply {

	getValuesForParameters() {
		return { };
	}

	setValuesFromParameters() {
		// Deliberately a noop.
	}

}

extend(Message_Reply_NowAway.prototype, {

	reply: Enum_Replies.RPL_NOWAWAY,
	abnf:  '":You have been marked as being away"'

});

module.exports = Message_Reply_NowAway;
