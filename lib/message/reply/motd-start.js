
var
	extend        = req('/lib/utility/extend'),
	Message_Reply = req('/lib/message/reply'),
	Enum_Replies  = req('/lib/enum/replies');

class Message_Reply_MotdStart extends Message_Reply {

	getHostname() {
		return this.hostname;
	}

	setHostname(hostname) {
		this.hostname = hostname;
		return this;
	}

	getValuesForParameters() {
		return {
			hostname: this.getHostname()
		};
	}

	setValuesFromParameters(parameters) {
		this.setHostname(parameters.get('hostname'));
	}

}

extend(Message_Reply_MotdStart.prototype, {

	reply:    Enum_Replies.RPL_MOTDSTART,
	abnf:     '":- " <hostname> " Message of the day -"',
	hostname: null

});

module.exports = Message_Reply_MotdStart;
