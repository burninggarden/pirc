
var
	extend         = req('/lib/utilities/extend'),
	CommandMessage = req('/lib/messages/command'),
	Commands       = req('/lib/constants/commands');


class PingMessage extends CommandMessage {

	getValuesForParameters() {
		return {
			server_name: [
				this.getOriginServerName(),
				this.getTargetServerName()
			]
		};
	}

	setValuesFromParameters(parameters) {
		this.setOriginServerName(parameters.getNext('server_name'));
		this.setTargetServerName(parameters.getNext('server_name'));
	}

}

extend(PingMessage.prototype, {
	command: Commands.PING,
	abnf:    '<server-name> [ <server-name> ]'
});

module.exports = PingMessage;
