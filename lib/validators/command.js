
var
	has                 = req('/lib/utilities/has'),
	Commands            = req('/lib/constants/commands'),
	InvalidCommandError = req('/lib/errors/invalid-command'),
	ErrorReasons        = req('/lib/constants/error-reasons');

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
