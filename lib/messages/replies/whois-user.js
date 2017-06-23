
var
	extend       = req('/lib/utilities/extend'),
	ReplyMessage = req('/lib/messages/reply'),
	Replies      = req('/lib/constants/replies');


class WhoisUserMessage extends ReplyMessage {

	getValuesForParameters() {
		return {
			nickname: this.getNickname(),
			username: this.getUsername(),
			hostname: this.getHostname(),
			realname: this.getRealname()
		};
	}

	setValuesFromParameters(parameters) {
		this.setNickname(parameters.get('nickname'));
		this.setUsername(parameters.get('username'));
		this.setHostname(parameters.get('hostname'));
		this.setRealname(parameters.get('realname'));
	}

}

extend(WhoisUserMessage.prototype, {

	reply: Replies.RPL_WHOISUSER,
	abnf:  '<nick> " " <user> " " <host> " * :" <realname>'

});

module.exports = WhoisUserMessage;
