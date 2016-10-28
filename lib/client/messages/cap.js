
var req = require('req');

var
	extend        = req('/utilities/extend'),
	ClientMessage = req('/lib/client/message'),
	Commands      = req('/constants/commands');


class ClientCapMessage extends ClientMessage {

}

extend(ClientCapMessage.prototype, {
	command: Commands.CAP
});

module.exports = ClientCapMessage;
