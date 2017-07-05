
var
	has      = req('/lib/utilities/has'),
	Commands = req('/lib/constants/commands');

function validate(command) {
	if (!command) {
		throw new Error('Invalid command: ' + command);
	}

	if (!has(Commands, command)) {
		throw new Error('Invalid command: ' + command);
	}
}

module.exports = {
	validate
};
