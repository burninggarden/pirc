
var
	extend        = req('/lib/utility/extend'),
	Message_Reply = req('/lib/message/reply'),
	Enum_Replies  = req('/lib/enum/replies');

class Message_Reply_WhoisServer extends Message_Reply {

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

extend(Message_Reply_WhoisServer.prototype, {

	reply: Enum_Replies.RPL_WHOISSERVER,
	abnf:  '<nick> " " <hostname> " :" <server-info>'

});

module.exports = Message_Reply_WhoisServer;
