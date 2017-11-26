
var
	has           = require('../utility/has'),
	Enum_Commands = require('../enum/commands');

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
