
var
	Message          = req('/lib/message'),
	CommandValidator = req('/lib/validator/command');

var
	extend = req('/lib/utility/extend');


class CommandMessage extends Message {

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
