
var
	Heket = require('heket');

var
	extend         = req('/lib/utilities/extend'),
	CommandMessage = req('/lib/messages/command'),
	Commands       = req('/lib/constants/commands');

var
	NeedMoreParametersMessage = req('/lib/messages/replies/need-more-parameters');


class PassMessage extends CommandMessage {

	setPassword(password) {
		this.password = password;
		return this;
	}

	getPassword() {
		return this.password;
	}

	getValuesForParameters() {
		return {
			password: this.getPassword()
		};
	}

	setValuesFromParameters(parameters) {
		this.setPassword(parameters.get('password'));
	}

	handleParameterParsingError(error) {
		if (!(error instanceof Heket.MissingRuleValueError)) {
			return super.handleParameterParsingError(error);
		}

		var message = new NeedMoreParametersMessage();

		message.setAttemptedCommand(Commands.PASS);
		message.setIsLethal();

		this.setImmediateResponse(message);
	}

}

extend(PassMessage.prototype, {
	command: Commands.PASS,
	abnf:    '<password>'
});

module.exports = PassMessage;
