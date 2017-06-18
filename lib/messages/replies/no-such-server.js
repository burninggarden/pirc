
var
	extend       = req('/lib/utilities/extend'),
	ReplyMessage = req('/lib/messages/reply'),
	Replies      = req('/lib/constants/replies');


class NoSuchMessage extends ReplyMessage {

	getValuesForParameters() {
		return {
			server_name: this.getServerName()
		};
	}

	setValuesFromParameters(parameters) {
		this.setServerName(parameters.get('server_name'));
	}

}

extend(NoSuchMessage.prototype, {
	reply: Replies.ERR_NOSUCHSERVER
});

module.exports = NoSuchMessage;
