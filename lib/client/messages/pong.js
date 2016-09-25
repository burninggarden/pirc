var req = require('req');

var
	extend        = req('/utilities/extend'),
	ClientMessage = req('/lib/client/message'),
	Commands      = req('/constants/commands');


class ClientPongMessage extends ClientMessage {

}

extend(ClientPongMessage.prototype, {
	command: Commands.PONG
});

module.exports = ClientPongMessage;
