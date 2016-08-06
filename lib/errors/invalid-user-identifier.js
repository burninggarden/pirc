var
	extend     = req('/utilities/extend'),
	BaseError  = req('/lib/errors/base'),
	ErrorCodes = req('/constants/error-codes');


class InvalidUserIdentifierError extends BaseError {

	setMessage() {
		this.message = 'Invalid user idenitifier: ' + this.value;
	}

}

extend(InvalidUserIdentifierError.prototype, {
	code: ErrorCodes.INVALID_USER_IDENTIFIER
});

module.exports = InvalidUserIdentifierError;
