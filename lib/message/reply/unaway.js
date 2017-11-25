
var
	extend        = req('/lib/utility/extend'),
	Message_Reply = req('/lib/message/reply'),
	Enum_Replies  = req('/lib/enum/replies');

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
