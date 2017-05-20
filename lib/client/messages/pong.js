
var
	extend        = req('/lib/utilities/extend'),
	ClientMessage = req('/lib/client/message'),
	Commands      = req('/lib/constants/commands');


class ClientPongMessage extends ClientMessage {

	serializeParams() {
		return ':' + this.getServerRemoteDetails().getHostname();
	}

	applyParsedParams(middle_params, trailing_param) {
		// NOTICE: We ignore any middle params here.
		this.getOrCreateRemoteServerDetails().setHostname(trailing_param);
	}

}

extend(ClientPongMessage.prototype, {
	command: Commands.PONG
});

module.exports = ClientPongMessage;
