
var
	has                  = req('/lib/utilities/has'),
	UserModes            = req('/lib/constants/user-modes'),
	ErrorReasons         = req('/lib/constants/error-reasons'),
	InvalidUserModeError = req('/lib/errors/invalid-user-mode');


function validate(mode) {
	if (!mode) {
		throw new InvalidUserModeError(mode, ErrorReasons.OMITTED);
	}

	if (!has(UserModes, mode)) {
		throw new InvalidUserModeError(mode, ErrorReasons.UNKNOWN_TYPE);
	}
}

module.exports = {
	validate: validate
};
