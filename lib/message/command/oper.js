
var
	Heket = require('heket');

var
	extend          = req('/lib/utility/extend'),
	Message_Command = req('/lib/message/command'),
	Enum_Commands   = req('/lib/enum/commands');

var
	Message_Reply_NeedMoreParameters = req('/lib/message/reply/need-more-parameters');


class Message_Command_Oper extends Message_Command {

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
			let message = new Message_Reply_NeedMoreParameters();

			message.setAttemptedCommand(Enum_Commands.OPER);

			this.setImmediateResponse(message);
		}
	}

}

extend(Message_Command_Oper.prototype, {
	command: Enum_Commands.OPER,
	abnf:    '<username> " " <password>'
});

module.exports = Message_Command_Oper;
