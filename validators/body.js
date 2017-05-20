var
	InvalidBodyError = req('/lib/errors/invalid-body'),
	ErrorReasons     = req('/lib/constants/error-reasons'),
	isString         = req('/utilities/is-string');


function validate(body) {
	if (!isString(body)) {
		throw new InvalidBodyError(body, ErrorReasons.WRONG_TYPE);
	}
}


module.exports = {
	validate
};
