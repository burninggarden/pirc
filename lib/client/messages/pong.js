var req = require('req');

var
	extend        = req('/utilities/extend'),
	ClientMessage = req('/lib/client/message'),
	Commands      = req('/constants/commands');


class ClientPongMessage extends ClientMessage {

	isFromClient() {
		return true;
	}

	serializeParams() {
		return ':' + this.getServerDetails().getHostname();
	}

	applyParsedParams(middle_params, trailing_param) {
		if (middle_params.length) {
			throw new Error('Invalid middle params');
		}

		this.getServerDetails().setHostname(trailing_param);
	}

}

extend(ClientPongMessage.prototype, {
	command: Commands.PONG
});

module.exports = ClientPongMessage;
