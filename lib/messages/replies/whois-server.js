
var
	extend       = req('/lib/utilities/extend'),
	ReplyMessage = req('/lib/messages/reply'),
	Replies      = req('/lib/constants/replies');

class WhoisServerMessage extends ReplyMessage {

	getValuesForParameters() {
		return {
			nick:        this.getNick(),
			server_name: this.getServerName(),
			server_info: this.getServerInfo()
		};
	}

	setValuesFromParameters(parameters) {
		this.setNick(parameters.get('nick'));
		this.setServerName(parameters.get('server_name'));
		this.setServerInfo(parameters.get('server_info'));
	}

}

extend(WhoisServerMessage.prototype, {

	reply: Replies.RPL_WHOISSERVER

});

module.exports = WhoisServerMessage;
