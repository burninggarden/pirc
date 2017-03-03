var req = require('req');

var
	extend        = req('/utilities/extend'),
	ClientMessage = req('/lib/client/message'),
	Commands      = req('/constants/commands');


class ClientPingMessage extends ClientMessage {

	serializeParams() {
		return this.getServerDetails().getHostname();
	}

	applyParsedParams(middle_params, trailing_param) {
		if (trailing_param !== null) {
			throw new Error('Invalid trailing param: ' + trailing_param);
		}

		this.getServerDetails().setHostname(middle_params[0]);
	}

}

extend(ClientPingMessage.prototype, {
	command: Commands.PING
});

module.exports = ClientPingMessage;
