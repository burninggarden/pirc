
var
	extend       = req('/lib/utilities/extend'),
	ReplyMessage = req('/lib/messages/reply'),
	Replies      = req('/lib/constants/replies');

class BounceMessage extends ReplyMessage {

	getValuesForParameters() {
		return {
			port:        this.getPort(),
			server_name: this.getServerName()
		};
	}

	setValuesFromParameters(parameters) {
		this.setServerName(parameters.get('server_name'));
		this.setPort(parameters.get('port'));
	}

}

extend(BounceMessage.prototype, {

	reply:       Replies.RPL_BOUNCE,
	server_name: null,
	port:        null

});

module.exports = BounceMessage;
