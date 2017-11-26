
var
	Message           = require('../message'),
	Validator_Command = require('../validator/command');

var
	extend = require('../utility/extend');


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
