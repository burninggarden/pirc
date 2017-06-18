
var
	extend       = req('/lib/utilities/extend'),
	ReplyMessage = req('/lib/messages/reply'),
	Replies      = req('/lib/constants/replies');

class MotdStartMessage extends ReplyMessage {

	getValuesForParameters() {
		return {
			server_name: this.getServerName()
		};
	}

	setValuesFromParameters(parameters) {
		this.setServerName(parameters.get('server_name'));
	}

}

extend(MotdStartMessage.prototype, {

	reply: Replies.RPL_MOTDSTART

});

module.exports = MotdStartMessage;
