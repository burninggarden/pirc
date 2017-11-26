
var
	extend        = require('../../utility/extend'),
	Message_Reply = require('../../message/reply'),
	Enum_Replies  = require('../../enum/replies');

class Message_Reply_Unaway extends Message_Reply {

	getValuesForParameters() {
		return { };
	}

	setValuesFromParameters(parameters) {
	}

}

extend(Message_Reply_Unaway.prototype, {

	reply: Enum_Replies.RPL_UNAWAY,
	abnf:  '":You are no longer marked as being away"'

});

module.exports = Message_Reply_Unaway;
