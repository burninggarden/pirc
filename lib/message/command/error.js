
var
	extend          = req('/lib/utility/extend'),
	Message_Command = req('/lib/message/command'),
	Enum_Commands   = req('/lib/enum/commands');


class Message_Command_Error extends Message_Command {

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

extend(Message_Command_Error.prototype, {
	command: Enum_Commands.ERROR,
	abnf:    '<error-message>',
	text:    null
});

module.exports = Message_Command_Error;
