
var
	extend       = req('/lib/utilities/extend'),
	ReplyMessage = req('/lib/messages/reply'),
	Replies      = req('/lib/constants/replies');


class WhoisAccountMessage extends ReplyMessage {

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

extend(WhoisAccountMessage.prototype, {

	reply: Replies.RPL_WHOISACCOUNT,
	abnf:  '<nick> " " <auth-name> " :is logged in as"'

});

module.exports = WhoisAccountMessage;
