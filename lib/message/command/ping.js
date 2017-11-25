
var
	extend          = req('/lib/utility/extend'),
	Message_Command = req('/lib/message/command'),
	Enum_Commands   = req('/lib/enum/commands');


class Message_Command_Ping extends Message_Command {

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

extend(Message_Command_Ping.prototype, {
	command: Enum_Commands.PING,
	abnf:    '<hostname> [ <hostname> ]'
});

module.exports = Message_Command_Ping;
