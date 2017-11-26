
var
	Heket = require('heket');

var
	extend          = require('../../utility/extend'),
	Message_Command = require('../../message/command'),
	Enum_Commands   = require('../../enum/commands');

var
	Message_Reply_NeedMoreParameters = require('../../message/reply/need-more-parameters');


class Message_Command_Pass extends Message_Command {

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

		var message = new Message_Reply_NeedMoreParameters();

		message.setAttemptedCommand(Enum_Commands.PASS);
		message.setIsLethal();

		this.setImmediateResponse(message);
	}

}

extend(Message_Command_Pass.prototype, {
	command: Enum_Commands.PASS,
	abnf:    '<password>'
});

module.exports = Message_Command_Pass;
