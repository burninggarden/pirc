var
	InvalidServerNameError = req('/lib/errors/invalid-server-name'),
	ErrorReasons           = req('/lib/constants/error-reasons'),
	isString               = req('/lib/utilities/is-string');


function validate(name) {
	if (!isString(name)) {
		throw new InvalidServerNameError(name, ErrorReasons.WRONG_TYPE);
	}
}


module.exports = {
	validate
};
