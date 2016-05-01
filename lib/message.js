
var req = require('req');

var
	has                               = req('/utilities/has'),
	Commands                          = req('/constants/commands'),
	InvalidCommandError               = req('/lib/errors/invalid-command'),
	ErrorReasons                      = req('/constants/error-reasons'),
	AbstractMethodNotImplementedError = req('/lib/errors/abstract-method-not-implemented');


class Message {

	constructor() {
		this.validate();
	}

	validate() {
		this.validateCommand();
	}

	validateCommand() {
		if (!this.command) {
			throw new InvalidCommandError(this.command, ErrorReasons.OMITTED);
		}

		if (!has(Commands, this.command)) {
			throw new InvalidCommandError(this.command, ErrorReasons.WRONG_TYPE);
		}
	}

	serialize() {
		throw new AbstractMethodNotImplementedError('serialize');
	}

}

module.exports = Message;
