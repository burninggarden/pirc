
var
	extend         = req('/lib/utilities/extend'),
	CommandMessage = req('/lib/messages/command'),
	Enum_Commands  = req('/lib/enum/commands');


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
	command: Enum_Commands.PING,
	abnf:    '<hostname> [ <hostname> ]'
});

module.exports = PingMessage;
