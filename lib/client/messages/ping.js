
var
	extend        = req('/utilities/extend'),
	ClientMessage = req('/lib/client/message'),
	Commands      = req('/constants/commands');


class ClientPingMessage extends ClientMessage {

	serializeParams() {
		return this.getRemoteServerDetails().getHostname();
	}

	applyParsedParams(middle_params, trailing_param) {
		// NOTICE: We just ignore the trailing parameter.
		this.getOrCreateRemoteServerDetails().setHostname(middle_params[0]);
	}

}

extend(ClientPingMessage.prototype, {
	command: Commands.PING
});

module.exports = ClientPingMessage;
