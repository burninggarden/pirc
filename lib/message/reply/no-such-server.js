
var
	extend        = req('/lib/utility/extend'),
	Message_Reply = req('/lib/message/reply'),
	Enum_Replies  = req('/lib/enum/replies');


class Message_Reply_NoSuchServer extends Message_Reply {

	getValuesForParameters() {
		return {
			hostname: this.getHostname()
		};
	}

	setValuesFromParameters(parameters) {
		this.setHostname(parameters.get('hostname'));
	}

}

extend(Message_Reply_NoSuchServer.prototype, {
	reply: Enum_Replies.ERR_NOSUCHSERVER,
	abnf:  '<hostname> " :No such server"'
});

module.exports = Message_Reply_NoSuchServer;
