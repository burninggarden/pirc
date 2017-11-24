
var
	extend         = req('/lib/utilities/extend'),
	CommandMessage = req('/lib/messages/command');

var
	Enum_Commands = req('/lib/enum/commands');


class AwayMessage extends CommandMessage {

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

extend(AwayMessage.prototype, {
	command: Enum_Commands.AWAY,
	abnf:    '[ ":" <away-message> ]',
	text:    null
});

module.exports = AwayMessage;
