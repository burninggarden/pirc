
var
	extend         = req('/lib/utilities/extend'),
	CommandMessage = req('/lib/messages/command'),
	Commands       = req('/lib/constants/commands');


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

}

extend(PassMessage.prototype, {
	command: Commands.PASS,
	abnf:    '<password>'
});

module.exports = PassMessage;
