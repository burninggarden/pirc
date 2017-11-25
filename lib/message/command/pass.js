
var
	Heket = require('heket');

var
	extend         = req('/lib/utility/extend'),
	CommandMessage = req('/lib/message/command'),
	Enum_Commands  = req('/lib/enum/commands');

var
	NeedMoreParametersMessage = req('/lib/message/reply/need-more-parameters');


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

		message.setAttemptedCommand(Enum_Commands.PASS);
		message.setIsLethal();

		this.setImmediateResponse(message);
	}

}

extend(PassMessage.prototype, {
	command: Enum_Commands.PASS,
	abnf:    '<password>'
});

module.exports = PassMessage;
