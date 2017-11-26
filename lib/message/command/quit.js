
var
	extend          = require('../../utility/extend'),
	Message_Command = require('../../message/command'),
	Enum_Commands   = require('../../enum/commands');


class Message_Command_Quit extends Message_Command {

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

extend(Message_Command_Quit.prototype, {
	command: Enum_Commands.QUIT,
	abnf:    '[ ":" <quit-message> ]',
	text:    null
});

module.exports = Message_Command_Quit;
