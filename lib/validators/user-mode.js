
var
	has       = req('/lib/utilities/has'),
	UserModes = req('/lib/constants/user-modes');

var
	InvalidUserModeError = req('/lib/errors/invalid-user-mode');


function validate(mode) {
	if (!mode) {
		throw new InvalidUserModeError('Invalid user mode: ' + mode);
	}

	if (!has(UserModes, mode)) {
		throw new InvalidUserModeError('Invalid user mode: ' + mode);
	}
}

module.exports = {
	validate: validate
};
