
var
	extend       = req('/lib/utility/extend'),
	ReplyMessage = req('/lib/message/reply'),
	Enum_Replies = req('/lib/enum/replies');


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
	reply: Enum_Replies.ERR_NOSUCHSERVER,
	abnf:  '<hostname> " :No such server"'
});

module.exports = NoSuchMessage;
