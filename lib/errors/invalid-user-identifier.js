var
	extend       = req('/utilities/extend'),
	BaseError    = req('/lib/errors/base'),
	ErrorCodes   = req('/constants/error-codes'),
	ErrorReasons = req('/constants/error-reasons');


class InvalidUserIdentifierError extends BaseError {

	setMessage() {
		this.message = 'Invalid user identifier: ' + this.value;
	}

}

extend(InvalidUserIdentifierError.prototype, {
	code:   ErrorCodes.INVALID_USER_IDENTIFIER,
	reason: ErrorReasons.INVALID_CHARACTERS
});

module.exports = InvalidUserIdentifierError;
