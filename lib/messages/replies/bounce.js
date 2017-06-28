
var
	extend       = req('/lib/utilities/extend'),
	ReplyMessage = req('/lib/messages/reply'),
	Replies      = req('/lib/constants/replies');

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

	reply:    Replies.RPL_BOUNCE,
	abnf:     '"Try server " <hostname> ", port " <port>',
	hostname: null,
	port:     null

});

module.exports = BounceMessage;
