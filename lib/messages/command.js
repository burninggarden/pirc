
var
	Message          = req('/lib/message'),
	CommandValidator = req('/lib/validators/command');

var
	extend = req('/lib/utilities/extend');


class CommandMessage extends Message {

	doSanityChecks() {
		this.validateCommand(this.getCommand());
	}

	getCommand() {
		return this.command;
	}

	validateCommand(command) {
		CommandValidator.validate(command);
	}

}

extend(CommandMessage.prototype, {
	command: null
});


module.exports = CommandMessage;
