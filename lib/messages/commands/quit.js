
var
	extend         = req('/lib/utilities/extend'),
	CommandMessage = req('/lib/messages/command'),
	Commands       = req('/lib/constants/commands');


class QuitMessage extends CommandMessage {

	getValuesForParameters() {
		return {
			quit_message: this.getQuitMessage()
		};
	}

	setValuesFromParameters(parameters) {
		this.setQuitMessage(parameters.get('quit_message'));
	}

}

extend(QuitMessage.prototype, {
	command: Commands.QUIT,
	abnf:    '[ <quit-message> ]'
});

module.exports = QuitMessage;
