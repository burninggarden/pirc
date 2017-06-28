
var
	extend       = req('/lib/utilities/extend'),
	ReplyMessage = req('/lib/messages/reply'),
	Replies      = req('/lib/constants/replies');


class NoSuchMessage extends ReplyMessage {

	getValuesForParameters() {
		return {
			hostname: this.getHostname()
		};
	}

	setValuesFromParameters(parameters) {
		this.setHostname(parameters.get('hostname'));
	}

}

extend(NoSuchMessage.prototype, {
	reply: Replies.ERR_NOSUCHSERVER,
	abnf:  '<hostname> " :No such server"'
});

module.exports = NoSuchMessage;
