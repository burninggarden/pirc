
var
	has                 = req('/utilities/has'),
	Commands            = req('/constants/commands'),
	InvalidCommandError = req('/lib/errors/invalid-command'),
	ErrorReasons        = req('/constants/error-reasons');

function validate(command) {
	if (!command) {
		throw new InvalidCommandError(command, ErrorReasons.OMITTED);
	}

	if (!has(Commands, command)) {
		throw new InvalidCommandError(command, ErrorReasons.WRONG_TYPE);
	}
}

module.exports = {
	validate
};
