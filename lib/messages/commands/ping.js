
var
	extend        = req('/lib/utilities/extend'),
	ClientMessage = req('/lib/client/message'),
	Commands      = req('/lib/constants/commands');


class ClientPingMessage extends ClientMessage {

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

extend(ClientPingMessage.prototype, {
	command: Commands.PING
});

module.exports = ClientPingMessage;
