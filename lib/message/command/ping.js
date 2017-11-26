
var
	extend          = require('../../utility/extend'),
	Message_Command = require('../../message/command'),
	Enum_Commands   = require('../../enum/commands');


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
