
var
	isArray               = req('/utilities/is-array'),
	InvalidUserModesError = req('/lib/errors/invalid-user-modes'),
	ErrorReasons          = req('/constants/error-reasons'),
	UserModeValidator     = req('/validators/user-mode');


function validate(user_modes) {
	if (!user_modes) {
		throw new InvalidUserModesError(user_modes, ErrorReasons.OMITTED);
	}

	if (!isArray(user_modes)) {
		throw new InvalidUserModesError(user_modes, ErrorReasons.WRONG_TYPE);
	}

	user_modes.forEach(UserModeValidator.validate);
}

module.exports = {
	validate
};
