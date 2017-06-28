
var
	extend       = req('/lib/utilities/extend'),
	ReplyMessage = req('/lib/messages/reply'),
	Replies      = req('/lib/constants/replies');

class WhoisServerMessage extends ReplyMessage {

	getValuesForParameters() {
		return {
			nickname:    this.getNickname(),
			hostname:    this.getHostname(),
			server_info: this.getServerInfo()
		};
	}

	setValuesFromParameters(parameters) {
		this.setNickname(parameters.get('nickname'));
		this.setHostname(parameters.get('hostname'));
		this.setServerInfo(parameters.get('server_info'));
	}

}

extend(WhoisServerMessage.prototype, {

	reply: Replies.RPL_WHOISSERVER,
	abnf:  '<nick> " " <hostname> " :" <server-info>'

});

module.exports = WhoisServerMessage;
