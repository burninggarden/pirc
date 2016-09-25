var req = require('req');

var
	extend        = req('/utilities/extend'),
	ClientMessage = req('/lib/client/message'),
	Commands      = req('/constants/commands');

class ClientNickMessage extends ClientMessage {

}

extend(ClientNickMessage.prototype, {
	command: Commands.NICK
});

module.exports = ClientNickMessage;
