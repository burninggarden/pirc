
var
	extend        = req('/lib/utility/extend'),
	Message_Reply = req('/lib/message/reply'),
	Enum_Replies  = req('/lib/enum/replies');

class Message_Reply_YouAreOperator extends Message_Reply {

	getValuesForParameters() {
		return { };
	}

	setValuesFromParameters() {
		// Deliberately a noop.
	}

}

extend(Message_Reply_YouAreOperator.prototype, {

	reply: Enum_Replies.RPL_YOUREOPER,
	abnf:  '":You are now an IRC operator"'

});

module.exports = Message_Reply_YouAreOperator;
