
var
	extend        = req('/lib/utility/extend'),
	Message_Reply = req('/lib/message/reply'),
	Enum_Replies  = req('/lib/enum/replies');

class Message_Reply_Bounce extends Message_Reply {

	getValuesForParameters() {
		return {
			port:     this.getPort(),
			hostname: this.getHostname()
		};
	}

	setValuesFromParameters(parameters) {
		this.setHostname(parameters.get('hostname'));
		this.setPort(parameters.get('port'));
	}

}

extend(Message_Reply_Bounce.prototype, {

	reply:    Enum_Replies.RPL_BOUNCE,
	abnf:     '"Try server " <hostname> ", port " <port>',
	hostname: null,
	port:     null

});

module.exports = Message_Reply_Bounce;
