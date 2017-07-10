
var
	extend         = req('/lib/utilities/extend'),
	CommandMessage = req('/lib/messages/command'),
	Commands       = req('/lib/constants/commands');


class QuitMessage extends CommandMessage {

	setText(quit_message) {
		this.quit_message = quit_message;
		return this;
	}

	getText() {
		return this.quit_message;
	}

	getValuesForParameters() {
		return {
			quit_message: this.getText()
		};
	}

	setValuesFromParameters(parameters) {
		this.setText(parameters.get('quit_message'));
	}

}

extend(QuitMessage.prototype, {
	command: Commands.QUIT,
	abnf:    '[ ":" <quit-message> ]',
	text:    null
});

module.exports = QuitMessage;
