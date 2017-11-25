
var
	extend       = req('/lib/utility/extend'),
	ReplyMessage = req('/lib/message/reply'),
	Enum_Replies = req('/lib/enum/replies');

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

	reply: Enum_Replies.RPL_WHOISSERVER,
	abnf:  '<nick> " " <hostname> " :" <server-info>'

});

module.exports = WhoisServerMessage;
