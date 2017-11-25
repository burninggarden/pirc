
var
	extend        = req('/lib/utility/extend'),
	Message_Reply = req('/lib/message/reply'),
	Enum_Replies  = req('/lib/enum/replies');


class Message_Reply_WhoisAccount extends Message_Reply {

	getValuesForParameters() {
		return {
			nickname:  this.getNickname(),
			auth_name: this.getAuthName()
		};
	}

	setValuesFromParameters(parameters) {
		this.setNickname(parameters.get('nickname'));
		this.setAuthName(parameters.get('auth_name'));
	}

}

extend(Message_Reply_WhoisAccount.prototype, {

	reply: Enum_Replies.RPL_WHOISACCOUNT,
	abnf:  '<nick> " " <auth-name> " :is logged in as"'

});

module.exports = Message_Reply_WhoisAccount;
