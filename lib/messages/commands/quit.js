
var
	extend         = req('/lib/utilities/extend'),
	CommandMessage = req('/lib/client/message'),
	Commands       = req('/lib/constants/commands');


class QuitMessage extends CommandMessage {

	serializeParameters() {
		throw new Error('implement');
	}

	applyParsedParameters() {
		throw new Error('implement');
	}

}

extend(QuitMessage.prototype, {
	command: Commands.QUIT
});

module.exports = QuitMessage;
