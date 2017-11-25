
var
	Message           = req('/lib/message'),
	Validator_Command = req('/lib/validator/command');

var
	extend = req('/lib/utility/extend');


class Message_Command extends Message {

	getCommand() {
		return this.command;
	}

	validateCommand(command) {
		Validator_Command.validate(command);
	}

}

extend(Message_Command.prototype, {
	command: null
});


module.exports = Message_Command;
