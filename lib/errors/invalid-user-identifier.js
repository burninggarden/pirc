var
	extend       = req('/lib/utilities/extend'),
	BaseError    = req('/lib/errors/base'),
	ErrorCodes   = req('/lib/constants/error-codes'),
	ErrorReasons = req('/lib/constants/error-reasons');


class InvalidUserIdError extends BaseError {

	getBody() {
		return 'Invalid user id: ' + this.value;
	}

}

extend(InvalidUserIdError.prototype, {
	code:   ErrorCodes.INVALID_USER_ID,
	reason: ErrorReasons.INVALID_CHARACTERS
});

module.exports = InvalidUserIdError;
