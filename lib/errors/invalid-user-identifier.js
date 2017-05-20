var
	extend       = req('/utilities/extend'),
	BaseError    = req('/lib/errors/base'),
	ErrorCodes   = req('/lib/constants/error-codes'),
	ErrorReasons = req('/lib/constants/error-reasons');


class InvalidUserIdentifierError extends BaseError {

	getBody() {
		return 'Invalid user identifier: ' + this.value;
	}

}

extend(InvalidUserIdentifierError.prototype, {
	code:   ErrorCodes.INVALID_USER_IDENTIFIER,
	reason: ErrorReasons.INVALID_CHARACTERS
});

module.exports = InvalidUserIdentifierError;
