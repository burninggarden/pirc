
var
	isArray           = req('/lib/utilities/is-array'),
	UserModeValidator = req('/lib/validators/user-mode');


function validate(user_modes) {
	if (!user_modes) {
		throw new Error('Invalid user modes: ' + user_modes);
	}

	if (!isArray(user_modes)) {
		throw new Error('Invalid user modes: ' + user_modes);
	}

	user_modes.forEach(UserModeValidator.validate);
}

module.exports = {
	validate
};
