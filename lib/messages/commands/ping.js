
var
	extend         = req('/lib/utilities/extend'),
	CommandMessage = req('/lib/messages/command'),
	Commands       = req('/lib/constants/commands');


class PingMessage extends CommandMessage {

	getValuesForParameters() {
		return {
			server_name: [
				this.getOriginHostname(),
				this.getTargetHostname()
			]
		};
	}

	setValuesFromParameters(parameters) {
		this.setOriginHostname(parameters.getNext('hostname'));
		this.setTargetHostname(parameters.getNext('hostname'));
	}

}

extend(PingMessage.prototype, {
	command: Commands.PING,
	abnf:    '<hostname> [ <hostname> ]'
});

module.exports = PingMessage;
