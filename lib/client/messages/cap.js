
var
	extend        = req('/utilities/extend'),
	ClientMessage = req('/lib/client/message'),
	Commands      = req('/lib/constants/commands');


class ClientCapMessage extends ClientMessage {

}

extend(ClientCapMessage.prototype, {
	command: Commands.CAP
});

module.exports = ClientCapMessage;
