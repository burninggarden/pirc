
var
	isString             = req('/lib/utilities/is-string'),
	InvalidUsernameError = req('/lib/errors/invalid-username'),
	ErrorReasons         = req('/lib/constants/error-reasons');

function validate(username) {
	if (!username) {
		throw new InvalidUsernameError(username, ErrorReasons.OMITTED);
	}

	if (!isString(username)) {
		throw new InvalidUsernameError(username, ErrorReasons.WRONG_TYPE);
	}
}

module.exports = {
	validate: validate
};
