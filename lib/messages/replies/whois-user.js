
var
	extend       = req('/lib/utilities/extend'),
	ReplyMessage = req('/lib/messages/reply'),
	Replies      = req('/lib/constants/replies');


class WhoisUserMessage extends ReplyMessage {

	getValuesForParameters() {
		return {
			nick:     this.getNick(),
			username: this.getUsername(),
			hostname: this.getHostname(),
			realname: this.getRealname()
		};
	}

	setValuesFromParameters(parameters) {
		this.setNick(parameters.get('nick'));
		this.setUsername(parameters.get('username'));
		this.setHostname(parameters.get('hostname'));
		this.setRealname(parameters.get('realname'));
	}

}

extend(WhoisUserMessage.prototype, {

	reply: Replies.RPL_WHOISUSER

});

module.exports = WhoisUserMessage;
