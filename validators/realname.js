
var
	isString             = req('/utilities/is-string'),
	InvalidRealnameError = req('/lib/errors/invalid-realname'),
	ErrorReasons         = req('/lib/constants/error-reasons');

function validate(realname) {
	if (!realname) {
		throw new InvalidRealnameError(realname, ErrorReasons.OMITTED);
	}

	if (!isString(realname)) {
		throw new InvalidRealnameError(realname, ErrorReasons.WRONG_TYPE);
	}
}

module.exports = {
	validate: validate
};
