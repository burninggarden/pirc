
var
	extend          = require('../../utility/extend'),
	Message_Command = require('../command');

var
	Enum_Commands = require('../../enum/commands');


class Message_Command_Away extends Message_Command {

	setText(away_message) {
		this.text = away_message;
		return this;
	}

	getText() {
		return this.text;
	}

	getValuesForParameters() {
		return {
			away_message: this.getText()
		};
	}

	setValuesFromParameters(parameters) {
		this.setText(parameters.get('away_message'));
	}

}

extend(Message_Command_Away.prototype, {
	command: Enum_Commands.AWAY,
	abnf:    '[ ":" <away-message> ]',
	text:    null
});

module.exports = Message_Command_Away;
