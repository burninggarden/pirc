
var
	has           = req('/lib/utility/has'),
	Enum_Commands = req('/lib/enum/commands');

function validate(command) {
	if (!command) {
		throw new Error('Invalid command: ' + command);
	}

	if (!has(Enum_Commands, command)) {
		throw new Error('Invalid command: ' + command);
	}
}

module.exports = {
	validate
};
