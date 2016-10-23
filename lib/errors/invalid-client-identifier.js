var
	extend     = req('/utilities/extend'),
	BaseError  = req('/lib/errors/base'),
	ErrorCodes = req('/constants/error-codes');


class InvalidClientIdentifierError extends BaseError {

	setMessage() {
		this.message = 'Invalid client idenitifier: ' + this.value;
	}

}

extend(InvalidClientIdentifierError.prototype, {
	code: ErrorCodes.INVALID_CLIENT_IDENTIFIER
});

module.exports = InvalidClientIdentifierError;
