
var
	extend       = req('/lib/utility/extend'),
	ReplyMessage = req('/lib/message/reply'),
	Enum_Replies = req('/lib/enum/replies');

class BounceMessage extends ReplyMessage {

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

extend(BounceMessage.prototype, {

	reply:    Enum_Replies.RPL_BOUNCE,
	abnf:     '"Try server " <hostname> ", port " <port>',
	hostname: null,
	port:     null

});

module.exports = BounceMessage;
