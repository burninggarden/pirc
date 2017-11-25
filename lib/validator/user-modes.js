
var
	isArray            = req('/lib/utility/is-array'),
	Validator_UserMode = req('/lib/validator/user-mode');

var
	Error_InvalidUserMode = req('/lib/error/invalid-user-mode');


function validate(user_modes) {
	if (!user_modes) {
		throw new Error_InvalidUserMode('Invalid user modes: ' + user_modes);
	}

	if (!isArray(user_modes)) {
		throw new Error_InvalidUserMode('Invalid user modes: ' + user_modes);
	}

	user_modes.forEach(Validator_UserMode.validate);
}

module.exports = {
	validate
};
