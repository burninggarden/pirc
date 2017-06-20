
var
	extend       = req('/lib/utilities/extend'),
	ReplyMessage = req('/lib/messages/reply'),
	Replies      = req('/lib/constants/replies');

class WhoisServerMessage extends ReplyMessage {

	getValuesForParameters() {
		return {
			nickname:    this.getNickname(),
			server_name: this.getServerName(),
			server_info: this.getServerInfo()
		};
	}

	setValuesFromParameters(parameters) {
		this.setNickname(parameters.get('nickname'));
		this.setServerName(parameters.get('server_name'));
		this.setServerInfo(parameters.get('server_info'));
	}

}

extend(WhoisServerMessage.prototype, {

	reply: Replies.RPL_WHOISSERVER

});

module.exports = WhoisServerMessage;
