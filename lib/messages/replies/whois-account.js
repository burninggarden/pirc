
var
	extend       = req('/lib/utilities/extend'),
	ReplyMessage = req('/lib/messages/reply'),
	Replies      = req('/lib/constants/replies');


class WhoisAccountMessage extends ReplyMessage {

	getValuesForParameters() {
		return {
			nick:      this.getNick(),
			auth_name: this.getAuthName()
		};
	}

	setValuesFromParameters(parameters) {
		this.setNick(parameters.get('nick'));
		this.setAuthName(parameters.get('auth_name'));
	}

}

extend(WhoisAccountMessage.prototype, {

	reply: Replies.RPL_WHOISACCOUNT

});

module.exports = WhoisAccountMessage;
