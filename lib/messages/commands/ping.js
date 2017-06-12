
var
	extend         = req('/lib/utilities/extend'),
	CommandMessage = req('/lib/messages/command'),
	Commands       = req('/lib/constants/commands');


class PingMessage extends CommandMessage {

	serializeParameters() {
		return this.getRemoteServerDetails().getHostname();
	}

	applyParsedParameters(middle_parameters, trailing_parameter) {
		// NOTICE: We just ignore the trailing parameter.

		if (middle_parameters.length) {
			let server_details = this.getOrCreateRemoteServerDetails();

			server_details.setHostname(middle_parameters[0]);
		}
	}

}

extend(PingMessage.prototype, {
	command: Commands.PING
});

module.exports = PingMessage;
