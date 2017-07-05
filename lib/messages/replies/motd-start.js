
var
	extend       = req('/lib/utilities/extend'),
	ReplyMessage = req('/lib/messages/reply'),
	Replies      = req('/lib/constants/replies');

class MotdStartMessage extends ReplyMessage {

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

extend(MotdStartMessage.prototype, {

	reply:    Replies.RPL_MOTDSTART,
	abnf:     '":- " <hostname> " Message of the day -"',
	hostname: null

});

module.exports = MotdStartMessage;
