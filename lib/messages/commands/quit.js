
var
	extend         = req('/lib/utilities/extend'),
	CommandMessage = req('/lib/messages/command'),
	Enum_Commands  = req('/lib/enum/commands');


class QuitMessage extends CommandMessage {

	setText(quit_message) {
		this.text = quit_message;
		return this;
	}

	getText() {
		return this.text;
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
	command: Enum_Commands.QUIT,
	abnf:    '[ ":" <quit-message> ]',
	text:    null
});

module.exports = QuitMessage;
