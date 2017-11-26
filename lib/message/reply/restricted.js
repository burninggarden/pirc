
var
	extend        = require('../../utility/extend'),
	Message_Reply = require('../../message/reply'),
	Enum_Replies  = require('../../enum/replies');

class Message_Reply_Restricted extends Message_Reply {

	getValuesForParameters() {
		return { };
	}

	setValuesFromParameters() {
		// Deliberately a noop.
	}

}

extend(Message_Reply_Restricted.prototype, {

	reply: Enum_Replies.ERR_RESTRICTED,
	abnf:  '":Your connection is restricted!"'

});

module.exports = Message_Reply_Restricted;
