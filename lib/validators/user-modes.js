
var
	isArray           = req('/lib/utilities/is-array'),
	UserModeValidator = req('/lib/validators/user-mode');

var
	InvalidUserModeError = req('/lib/errors/invalid-user-mode');


function validate(user_modes) {
	if (!user_modes) {
		throw new InvalidUserModeError('Invalid user modes: ' + user_modes);
	}

	if (!isArray(user_modes)) {
		throw new InvalidUserModeError('Invalid user modes: ' + user_modes);
	}

	user_modes.forEach(UserModeValidator.validate);
}

module.exports = {
	validate
};
