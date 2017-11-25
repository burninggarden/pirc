
var
	extend         = req('/lib/utility/extend'),
	CommandMessage = req('/lib/message/command'),
	Enum_Commands  = req('/lib/enum/commands');


class ErrorMessage extends CommandMessage {

	setText(text) {
		this.text = text;
		return this;
	}

	getText() {
		return this.text;
	}

	getValuesForParameters() {
		return {
			error_message: this.getText()
		};
	}

	setValuesFromParameters(parameters) {
		this.setText(parameters.get('error_message'));
	}

}

extend(ErrorMessage.prototype, {
	command: Enum_Commands.ERROR,
	abnf:    '<error-message>',
	text:    null
});

module.exports = ErrorMessage;
