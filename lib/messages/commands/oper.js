
var
	Heket = require('heket');

var
	extend         = req('/lib/utilities/extend'),
	CommandMessage = req('/lib/messages/command'),
	Commands       = req('/lib/constants/commands');

var
	NeedMoreParametersMessage = req('/lib/messages/replies/need-more-parameters');


class OperMessage extends CommandMessage {

	setUsername(username) {
		this.username = username;
		return this;
	}

	getUsername() {
		return this.username;
	}

	setPassword(password) {
		this.password = password;
		return this;
	}

	getPassword() {
		return this.password;
	}

	getValuesForParameters() {
		return {
			username: this.getUsername(),
			password: this.getPassword()
		};
	}

	setValuesFromParameters(parameters) {
		this.setUsername(parameters.get('username'));
		this.setPassword(parameters.get('password'));
	}

	handleParameterParsingError(error) {
		if (
			   error instanceof Heket.MissingRuleValueError
			|| error instanceof Heket.InputTooShortError
		) {
			let message = new NeedMoreParametersMessage();

			message.setAttemptedCommand(Commands.OPER);

			this.setImmediateResponse(message);
		}
	}

}

extend(OperMessage.prototype, {
	command: Commands.OPER,
	abnf:    '<username> " " <password>'
});

module.exports = OperMessage;
