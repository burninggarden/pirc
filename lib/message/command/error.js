
var
	extend          = require('../../utility/extend'),
	Message_Command = require('../../message/command'),
	Enum_Commands   = require('../../enum/commands');


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
